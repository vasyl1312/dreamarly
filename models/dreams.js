const { Schema, model } = require("mongoose");

const dreamSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  categories: { type: Array, required: true },
  date: { type: Date, default: Date.now },
  author: { type: Schema.Types.ObjectId, ref: "User", default: null },

  reactions: {
    very_cool: { type: Number, default: 0 },
    pleasant: { type: Number, default: 0 },
    funny: { type: Number, default: 0 },
    mind_blown: { type: Number, default: 0 },
    weird: { type: Number, default: 0 },
    dislike: { type: Number, default: 0 },
  },

  reactionUsers: {
    type: Map,
    of: String,
    default: {},
  },
});

module.exports = model("Dream", dreamSchema);
