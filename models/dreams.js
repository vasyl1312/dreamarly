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

  // author: {

  // img: String,
  // userId: {
  //   type: Schema.Types.ObjectId,
  //   ref: 'User', //взаємодія між продуктом та користувачем
  // },
});

module.exports = model("dream", dreamSchema);
