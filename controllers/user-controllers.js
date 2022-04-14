const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");
const User = require("../Models/User");

const signup = async (req, res, next) => {
  const { fullname, email, password } = req.body;
  console.log(req.body);

  if (fullname && email && password) {
    let existingUser;
    try {
      existingUser = await User.findOne({ email: email });

      if (existingUser) {
        console.log("user already exists");
        res.json({ message: "User Email Already Exists", success: false });
        return;
      }
    } catch (err) {
      console.log(err);
      res.json({
        success: false,
        data: err,
        message: "Signing up failed, please try again later.",
      });
    }

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, 12);
    } catch (err) {
      console.log(err);
      console.log(
        "Signing up failed as hashing failed, please try again later."
      );

      res.json({
        success: false,
        data: err,
        message: "Signing up failed, please try again later.",
      });
      return;
    }

    const createdUser = new User({
      username: fullname,
      email,
      password: hashedPassword,
      role: "user",
    });

    try {
      createdUser.save((err) => {
        if (err) {
          console.log(err);
          res.json({
            success: false,
            data: err,
            message: "Signing up failed, please try again later.",
          });
          return;
        } else {
          res.json({
            message: "Welcome to Easy Dine",
            success: true,
          });
        }
      });
    } catch (err) {
      console.log(err);
      res.json({
        success: false,
        data: err,
        message:
          "Signing up and creating user failed failed, please try again later.",
      });
    }
  } else {
    res.json({ message: "Please Enter all the Details", success: false });
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  let existingUser;

  console.log(email, password);

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    res.json({
      success: false,
      message: "Logging in failed, please try again later.",
    });
    return;
  }

  if (!existingUser) {
    res.json({
      success: false,
      message: "Logging in failed, please try again later.",
    });

    return;
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {
    res.json({
      success: false,
      data: err,
      message:
        "Could not log you in, please check your credentials and try again.",
    });
    return;
  }

  if (!isValidPassword) {
    res.json({
      success: false,
      message:
        "Could not log you in, please check your credentials and try again.",
    });
    return;
  }

  let access_token;
  try {
    access_token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      "myprivatekey",
      { expiresIn: "1h" }
    );
  } catch (err) {
    res.json({
      success: false,
      data: err,
      message: "Logging in failed, please try again later.",
    });
    return;
  }

  res.json({
    message: "you are login success fully ",
    username: existingUser.username,
    id: existingUser._id,
    role: existingUser.role,
    email: existingUser.email,
    access_token: access_token,
    success: true,
  });
};

module.exports = {
  signup,
  login,
};
