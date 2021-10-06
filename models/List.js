const { Schema, model } = require('mongoose');

const ListSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'List title must be provided!'],
      trim: true,
      maxlength: [50, 'List title can not be more than 50 characters'],
    },
    board: {
      type: Schema.Types.ObjectId,
      ref: 'Board',
      required: true,
    },
    cards: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Card',
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = model('List', ListSchema);
