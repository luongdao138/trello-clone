const User = require('../models/User');
const Board = require('../models/Board');
const { BadRequestError } = require('../errors');

module.exports = {
  getUser: async (req, res) => {
    res.json({ user: req.user });
  },
  searchUser: async (req, res) => {
    const { searchTerm, boardId } = req.query;
    const board = await Board.findById(boardId);
    if (!board)
      throw new BadRequestError(`Can not find board with id ${boardId}`);

    const boardMembers = board.members.map((m) => m.user);

    const users = await User.find({
      username: { $regex: searchTerm, $options: 'i' },
      _id: {
        $nin: boardMembers,
      },
    })
      .select('_id username avatar')
      .limit(10);
    return res.json({ users });
  },
};
