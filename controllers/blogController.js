const Post = require("../models/blogModel");

exports.getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find().select("-__v");
    res
      .status(200)
      .render("blog/posts", { posts, title: "blog posts", time: req.time });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      data: {
        error: error.message,
      },
    });
  }
};
exports.getAPost = async (req, res, next) => {
  try {
    const post = await Post.findOne({ slug: req.params.slug }).select("-__v");

    if (!post) {
      return next(new Error("Post is not found"));
    }
    res
      .status(200)
      .render("blog/singlePost", { post, title: post.title, time: req.time });
  } catch (error) {
    res.status(404).render("error");
  }
};
exports.showForm = async (req, res, next) => {
  res.render("blog/showForm", { title: "Blog | Form", time: req.time });
};

exports.postToDb = async (req, res, next) => {
  try {
    const postExists = await Post.findOne({ title: req.body.title });
    if (postExists) {
      return next(new Error("Post already exists"));
    }
    const post = await Post.create(req.body);
    post.__v = undefined;
    res.status(201).redirect("/blog");
  } catch (error) {
    res.status(400).render("/blog/posts");
  }
};
