const Post = require("../models/blogModel");

exports.getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().select("-__v");
    res.status(200).json({
      status: "success",
      result: posts.length,
      data: {
        posts,
      },
    });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      data: {
        error: error.message,
      },
    });
  }
};

exports.postToDb = async (req, res, next) => {
  try {
    const postExists = await Post.find({ title: req.body.title });
    if (postExists.length) {
      return next(new Error("Post already exists"));
    }
    const post = await Post.create(req.body);
    post.__v = undefined;

    res.status(201).json({
      status: "success",
      data: {
        post,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
