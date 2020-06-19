const Post = require("../models/blogModel");

exports.showForm = async (req, res, next) => {
  res.render("adminBlog/showForm", {
    title: "Blog | Form",
    time: req.time,
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.getAdminDashboard = async (req, res, next) => {
  res.status(200).render("adminBlog/dashboard", {
    title: "Admin Dashboard",
    time: req.time,
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postToDb = async (req, res, next) => {
  if (req.body.title === "" && req.body.markdown === "") {
    return res.send("Both are Required");
  }

  try {
    const postExists = await Post.findOne({ title: req.body.title });
    if (postExists) {
      return next(new Error("Post already exists"));
    }

    const post = await Post.create(req.body);
    console.log(post);
    post.__v = undefined;
    res.status(201).redirect("/dashboard/posts");
  } catch (error) {
    res.status(400).render("404");
  }
};
exports.getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({});
    posts.__v = undefined;
    res.render("adminBlog/allPosts", {
      title: "posts",
      time: req.time,
      isAuthenticated: false,
      posts,
    });
  } catch (error) {
    res.status(400).render("404");
  }
};
exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findOneAndRemove({ _id: req.params.postId });
    res.redirect("/dashboard/posts");
  } catch (error) {
    res.status(400).render("404");
  }
};