const Admin = require("../models/adminModel");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");

exports.getAdminPage = async (req, res, next) => {
  res
    .status(200)
    .render("blog/admin", { title: "Tolu's blog", time: req.time });
};
exports.getDashboard = async (req, res, next) => {
  res
    .status(200)
    .render("blog/dashboard", { title: "Tolu's blog", time: req.time });
};

exports.signupUser = async (req, res, next) => {
  const newUser = await Admin.create(req.body);
  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
};

exports.signupTutor = async (req, res, next) => {
  req.body.role = "tutor";
  const newTutor = await User.create(req.body);
  const token = jwt.sign({ id: newTutor._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newTutor,
    },
  });
};

exports.login = async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new Error("Please enter email and password", 400));
  }

  const user = await Admin.findOne({ username }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new Error("Incorrect email or password", 401));
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.cookie("jwt", token, {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    // secure: true,
    httpOnly: true,
  });
  (user.password = undefined), (user.__v = undefined);

  res.status(200).render("blog/admin-oreofe", {
    title: "Oreofe's Dashboard",
    time: req.time,
    user: user,
  });
};

exports.authorize = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new Error("You are not login, please log in", 401));
  }

  const decodedToken = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  );

  const currentUser = await User.findById(decodedToken.id);
  if (!currentUser) {
    return next(new Error("The user doesnt exists", 401));
  }

  if (currentUser.changedPasswordAfter(decodedToken.iat)) {
    return next(
      new Error("User recently changed password! please log in again", 401)
    );
  }
  req.user = currentUser;
  next();
};

exports.authorizeFor = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new Error("You do not have access to perform the operation!")
      );
    }
    next();
  };
};

const user = {
  username: "Admin-oreofe",
  image: "https:tolu.com",
  password: "123",
  role: "admin",
};

// Admin.create(user, (error) => {
//   if (error) {
//     throw error;
//   }
// });
