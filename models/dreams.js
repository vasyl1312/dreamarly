const { Schema, model } = require("mongoose");

const dreamSchema = new Schema({
  title: {
    type: String,
    required: true,
  },

  description: {
    type: String,
    required: true,
  },

  categories: {
    type: Array,
    required: true,
  },

  date: Date,

  reactions: {
    very_cool: { type: Number, default: 0 },
    pleasant: { type: Number, default: 0 },
    funny: { type: Number, default: 0 },
    mind_blown: { type: Number, default: 0 },
    weird: { type: Number, default: 0 },
    dislike: { type: Number, default: 0 },
  },

  // const reactionEmojis = {
  //   "very_cool": "😍",
  //   "pleasant": "😊",
  //   "funny": "😆",
  //   "mind_blown": "🤯",
  //   "weird": "🤔",
  //   "dislike": "👎"
  // };
  

  // author: {

  // img: String,
  // userId: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'User', //взаємодія між продуктом та користувачем
  // },
});

module.exports = model("dream", dreamSchema);
