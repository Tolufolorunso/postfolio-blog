const mongoose = require("mongoose");
// const validator = require("express-validator");

const postSchema = new mongoose.Schema({
  post: {
    type: String,
    required: [true, "post required"],
  },
  title: {
    type: String,
    unique: true,
    required: [true, "required"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
