const Card = require('../models/Card');
const List = require('../models/List');
const User = require('../models/User');
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require('../errors');
const { StatusCodes } = require('http-status-codes');

module.exports = {
  createNewCard: async (req, res) => {
    const { title, listId } = req.body;
    if (!title) {
      throw new BadRequestError('Card title can not be empty!');
    }

    let list = await List.findById(listId);
    if (!list) {
      throw new NotFoundError(`Can not find list with id ${listId}`);
    }

    let newCard = new Card({ title });
    newCard = await newCard.save();
    list.cards.push(newCard._id);
    await list.save();
    return res.status(StatusCodes.CREATED).json({ card: newCard });
  },
  getSingleCard: async (req, res) => {
    const { cardId } = req.params;
    const card = await Card.findById(cardId).populate({
      path: 'members',
      model: User,
      select: '_id username avatar',
    });

    if (!card) throw new NotFoundError(`Cannot find card with id ${cardId}`);

    return res.json({
      card,
    });
  },
  updateCard: async (req, res) => {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);
    if (!card) throw new NotFoundError(`Cannot find card with id ${cardId}`);

    const updatedCard = await Card.findByIdAndUpdate(cardId, req.body, {
      new: true,
      runValidators: true,
    }).populate({
      path: 'members',
      model: User,
      select: '_id username avatar',
    });

    return res.json({ card: updatedCard });
  },
};
