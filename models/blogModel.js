const mongoose = require("mongoose");
const slugify = require("slugify");
const marked = require("marked");
const createDomPurify = require("dompurify");
const { JSDOM } = require("jsdom");

const dompurify = createDomPurify(new JSDOM().window);

// const validator = require("express-validator");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    unique: true,
    required: [true, "required"],
  },
  slug: {
    type: String,
    unique: true,
  },
  markdown: {
    type: String,
    required: true,
  },
  sanitizeHTML: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  image: {
    type: String,
    default: "/images/apitutor.png",
  },
});

postSchema.pre("validate", function (next) {
  if (this.title) {
    this.slug = slugify(this.title, {
      lower: true,
      strict: true,
    });
  }
  if (this.markdown) {
    this.sanitizeHTML = dompurify.sanitize(marked(this.markdown));
  }
  next();
});

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
