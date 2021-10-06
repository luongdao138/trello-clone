const List = require('../models/List');
const Board = require('../models/Board');
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require('../errors');
const { StatusCodes } = require('http-status-codes');
const Card = require('../models/Card');
const User = require('../models/User');

module.exports = {
  getListsOfBoard: async (req, res) => {
    const { boardId } = req.params;
    const lists = await List.find({ board: boardId })
      .select('-createdAt -updatedAt')
      .populate({
        path: 'cards',
        model: Card,
        select: '_id title labels cover_photo comment_count attachment_count',
        populate: {
          path: 'members',
          model: User,
          select: '_id username avatar',
        },
      });

    return res.json({ lists });
  },
  createNewList: async (req, res) => {
    const { boardId, title } = req.body;
    const user = req.user;
    if (!title) {
      throw new BadRequestError('Title can not be empty!');
    }
    const board = await Board.findById(boardId);
    if (!board) throw new NotFoundError(`Cannot find board with id ${boardId}`);

    const isBoardMember = board.members.some(
      (m) => m.user.toString() === user._id.toString()
    );
    if (!isBoardMember) {
      throw new UnauthorizedError(`Update actions are not allowed!`);
    }

    let newList = new List({ title, board: boardId });
    newList = await newList.save();
    return res.status(StatusCodes.CREATED).json({ list: newList });
  },
  handleDragAndDrop: async (req, res) => {
    const {
      sourceListId,
      sourceListIndex,
      desListId,
      desListIndex,
      draggableCardId,
    } = req.body;

    if (sourceListId === desListId) {
      const sourceList = await List.findById(sourceListId);
      sourceList.cards.splice(sourceListIndex, 1);
      sourceList.cards.splice(desListIndex, 0, draggableCardId);
      await sourceList.save();
    } else {
      const sourceList = await List.findById(sourceListId);
      const desList = await List.findById(desListId);
      sourceList.cards.splice(sourceListIndex, 1);
      desList.cards.splice(desListIndex, 0, draggableCardId);
      await sourceList.save();
      await desList.save();
    }

    return res.json({ msg: 'Update success!' });
  },
  updateList: async (req, res) => {
    const { listId } = req.params;
    let list = await List.findById(listId);
    if (!list) {
      throw new NotFoundError(`Cannot find list with id ${listId}`);
    }
    list = await List.findByIdAndUpdate(listId, req.body, {
      new: true,
      runValidators: true,
    })
      .select('-createdAt -updatedAt')
      .populate({
        path: 'cards',
        model: Card,
        select: '_id title labels cover_photo comment_count attachment_count',
        populate: {
          path: 'members',
          model: User,
          select: '_id username avatar',
        },
      });

    return res.json({ list });
  },
};
