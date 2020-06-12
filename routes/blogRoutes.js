const express = require("express");
const router = express.Router();

const blogController = require("../controllers/blogController");

router.route("/").get(blogController.getAllPosts);
router.route("/new").get(blogController.showForm);

router.route("/:slug").get(blogController.getAPost);

router.route("/posts").post(blogController.postToDb);

module.exports = router;
