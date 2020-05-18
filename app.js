require("dotenv").config();
const cors = require("cors");
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(cors());
app.use(express.static(`${__dirname}/public`));
app.set("view engine", "ejs");

// Customs Middleware
app.use((req, res, next) => {
  const now = new Date();
  req.time = {
    year: now.getFullYear(),
    today: now.toDateString(),
  };
  console.log(req.time);
  next();
});

app
  .route("/")
  .get((req, res) => {
    res.status(200).render("index", { title: "Tolu's blog", time: req.time });
  })
  .post((req, res) => {
    res.send("working");
  });

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
