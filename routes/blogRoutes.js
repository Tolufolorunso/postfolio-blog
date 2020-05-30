const express = require("express");
const router = express.Router();

const blogController = require("../controllers/blogController");

router
  .route("/posts")
  .post(blogController.postToDb)
  .get(blogController.getAllPosts);

module.exports = router;
