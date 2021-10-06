const { model, Schema } = require('mongoose');

const CommentSchema = new Schema(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    card: {
      type: Schema.Types.ObjectId,
      ref: 'Card',
    },
    content: String,
  },
  {
    timestamps: true,
  }
);

module.exports = model('Comment', CommentSchema);
