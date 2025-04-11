const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dream: {
      type: Schema.Types.ObjectId,
      ref: "Dream",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    replies: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);
