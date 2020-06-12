exports.appTime = (req, res, next) => {
  const now = new Date();
  req.time = {
    year: now.getFullYear(),
    today: now.toDateString(),
  };
  next();
};

exports.globalError = (error, req, res, next) => {
  if (error) {
    res
      .status(422)
      .render("error", {
        title: "Error page",
        time: req.time,
        error: error.message,
      });
  }
};
