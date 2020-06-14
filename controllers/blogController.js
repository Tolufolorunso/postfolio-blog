const Post = require("../models/blogModel");

exports.getAllPosts = async (req, res, next) => {
  let diff;
  try {
    const posts = await Post.find().select("-__v");
    posts.forEach((post) => {
      diff = new Date() - new Date(post.createdAt);
      const min = Math.round(diff / 1000 / 60);
      const hours = Math.round(min / 60);
      const day = Math.round(hours / 24);
      post.day = day;
    });

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
    diff = new Date() - new Date(post.createdAt);
    const min = Math.round(diff / 1000 / 60);
    const hours = Math.round(min / 60);
    const day = Math.round(hours / 24);
    post.day = day;
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
    res.status(400).render("404");
  }
};
