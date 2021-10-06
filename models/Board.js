const { Schema, model } = require('mongoose');

const MemberSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    role: {
      type: String,
      enum: ['MEMBER', 'ADMIN'],
      default: 'MEMBER',
    },
  },
  {
    _id: false,
  }
);

const BoardSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: [50, 'Board title cannot be more than 50 characters!'],
    },
    cover_photo: String,
    visibility: {
      type: String,
      enum: {
        values: ['PUBLIC', 'PRIVATE'],
        message: 'Visibility not supported!',
      },
    },
    description: String,
    members: [MemberSchema],
    code: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = model('Board', BoardSchema);
