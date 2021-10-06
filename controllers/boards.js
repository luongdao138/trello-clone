const { BadRequestError } = require('../errors');
const { validateBoard } = require('../helpers/validateData');
const Board = require('../models/Board');
const { StatusCodes } = require('http-status-codes');
const User = require('../models/User');
const { NotFoundError, UnauthorizedError } = require('../errors');
const { v4 } = require('uuid');

module.exports = {
  getSingleBoard: async (req, res) => {
    const { boardId } = req.params;
    const board = await Board.findById(boardId).populate({
      path: 'members.user',
      model: User,
      select: '_id username avatar',
    });
    if (!board) {
      throw new NotFoundError(`Cannot find board with id ${boardId}`);
    }
    return res.json({ board });
  },
  getAllBoardsOfAnUser: async (req, res) => {
    const user = req.user;
    const boards = await Board.find({
      $or: [{ 'members.user': user._id }, { visibility: 'PUBLIC' }],
    })
      .populate({
        path: 'members.user',
        model: User,
        select: '_id username avatar',
      })
      .select('-description')
      .sort('createdAt');
    res.json({ boards });
  },
  createBoard: async (req, res) => {
    const user = req.user;
    const errors = validateBoard(req.body);
    if (Object.keys(errors).length) {
      throw new BadRequestError(errors[Object.keys(errors)[0]]);
    }
    const { title, visibility, cover_photo } = req.body;
    let newBoard = new Board({
      title,
      visibility,
      cover_photo,
      members: [
        {
          user: user._id,
          role: 'ADMIN',
        },
      ],
      code: v4(),
    });
    newBoard = await newBoard.save();
    const returnBoard = {
      ...newBoard._doc,
      members: [
        {
          user: {
            _id: user._id,
            username: user.username,
            avatar: user.avatar,
          },
          role: 'ADMIN',
        },
      ],
    };
    res.status(StatusCodes.CREATED).json({
      board: returnBoard,
    });
  },
  updateBoard: async (req, res) => {
    const user = req.user;
    const { boardId } = req.params;
    const board = await Board.findById(boardId);
    if (!board) throw new NotFoundError(`Cannot find board with id ${boardId}`);

    const isBoardMember = board.members.some(
      (m) => m.user.toString() === user._id.toString()
    );
    if (!isBoardMember) {
      throw new UnauthorizedError(`Update actions are not allowed!`);
    }

    const updatedBoard = await Board.findByIdAndUpdate(boardId, req.body, {
      new: true,
      runValidators: true,
    }).populate({
      path: 'members.user',
      model: User,
      select: '_id username avatar',
    });
    return res.json({ board: updatedBoard });
  },
  joinBoardByCode: async (req, res) => {
    const { code } = req.body;
    if (!code) throw new BadRequestError('Code not provided!');

    let board = await Board.findOne({ code })
      .populate({
        path: 'members.user',
        model: User,
        select: '_id username avatar',
      })
      .select('-description');
    if (!board) throw new NotFoundError('Cannot find board with this code!');

    const isExist = board.members.find(
      (x) => x.user._id.toString() === req.user._id.toString()
    );
    if (isExist) throw new BadRequestError('Already in this board');

    board.members.push({
      user: {
        _id: req.user._id,
        username: req.user.username,
        avatar: req.user.avatar,
      },
      role: 'MEMBER',
    });
    board = await board.save();

    return res.json({
      board,
    });
  },
  deleteBoard: async (req, res) => {},
};
