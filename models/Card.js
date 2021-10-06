const { Schema, model } = require('mongoose');

const LabelSchema = new Schema(
  {
    name: String,
    color: String,
  },
  {
    _id: false,
  }
);

const CardSchema = new Schema(
  {
    title: {
      type: String,
      required: [true, 'List title must be provided!'],
      trim: true,
      maxlength: [50, 'List title can not be more than 50 characters'],
    },
    description: {
      type: String,
    },
    cover_photo: String,
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    labels: [LabelSchema],
    attachment_count: {
      type: Number,
      default: 0,
    },
    comment_count: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model('Card', CardSchema);
