const Comment = require('../models/Comment');
const Card = require('../models/Card');
const User = require('../models/User');
const {
  BadRequestError,
  NotFoundError,
  UnauthorizedError,
} = require('../errors');
const { StatusCodes } = require('http-status-codes');

module.exports = {
  getAllCommentsOfCard: async (req, res) => {
    const { cardId } = req.query;
    if (!cardId) throw new BadRequestError('Card id is required!');

    const comments = await Comment.find({ card: cardId })
      .populate({
        path: 'creator',
        model: User,
        select: '_id username avatar',
      })
      .select('-card -updatedAt')
      .sort('createdAt');

    return res.json({ comments });
  },
  createComment: async (req, res) => {
    const { content, cardId } = req.body;
    if (!content || !cardId) {
      throw new BadRequestError('Content and card id is required!');
    }
    let card = await Card.findById(cardId);
    if (!card) throw new NotFoundError(`Cannot find card with id ${cardId}`);

    let newComment = new Comment({
      card: cardId,
      content,
      creator: req.user._id,
    });
    newComment = await newComment.save();
    card.comment_count = card.comment_count + 1;
    await card.save();
    return res.status(StatusCodes.CREATED).json({
      comment: {
        ...newComment._doc,
        creator: {
          _id: req.user._id,
          username: req.user.username,
          avatar: req.user.avatar,
        },
      },
    });
  },
  editComment: async (req, res) => {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment)
      throw new NotFoundError(`Cannot find comment with id ${commentId}`);

    if (comment.creator.toString() !== req.user._id.toString())
      throw new UnauthorizedError('Not allowed to edit this comment');

    const updatedComment = await Comment.findByIdAndUpdate(
      commentId,
      req.body,
      {
        runValidators: true,
        new: true,
      }
    ).populate({
      path: 'creator',
      model: User,
      select: '_id username avatar',
    });
    return res.json({ comment: updatedComment });
  },
  deleteComment: async (req, res) => {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);
    if (!comment)
      throw new NotFoundError(`Cannot find comment with id ${commentId}`);

    if (comment.creator.toString() !== req.user._id.toString())
      throw new UnauthorizedError('Not allowed to edit this comment');

    let card = await Card.findById(comment.card);
    card.comment_count = card.comment_count - 1;
    await card.save();

    await Comment.findByIdAndDelete(commentId);
    return res.json({ msg: 'Delete comment successfully!' });
  },
};
