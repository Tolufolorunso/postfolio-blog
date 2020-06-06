const cors = require("cors");
const compression = require("compression");
const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const { appTime, globalError } = require("./middlewares/middleware");

require("dotenv").config();

const adminRoutes = require("./routes/adminRoutes");
const blogApiRoutes = require("./routes/blogRoutes");

const app = express();

// Middlewares
app.use(express.json({ limit: "10kb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cors());
app.use(express.static(`${__dirname}/public`));
app.set("view engine", "ejs");

// Customs Middleware
app.use(appTime);
app.use(compression());

app.use("/admin", adminRoutes);
app.use("/blog", blogApiRoutes);

app.get("/", (req, res) => {
  res.status(200).render("index", { title: "Tolu's blog", time: req.time });
});
app.get("*", (req, res) => {
  res.status(200).render("404", { title: "Tolu's blog", time: req.time });
});

// const DB =
//   "mongodb+srv://josh:jesus000@cluster0-hziu4.mongodb.net/farmvest?retryWrites=true&w=majority";

// const DB_LOCAL = "mongodb://localhost:27017/farmvest";

mongoose
  .connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then((c) => console.log("DATABASE connection successfull"));

app.use(globalError);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
