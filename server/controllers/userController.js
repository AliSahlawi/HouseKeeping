import UserModel from "../Models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    //Validation
    if (!name || !email || !password) {
      return res.status(422).json({
        message: "Please provide all fields!",
        success: false,
      });
    }
    //Password validation
    if (password.length < 6) {
      return res.status(422).json({
        message: "Password length should be greater than 6 character",
        success: false,
      });
    }

    //Check existing user
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        message: "User Already Exists!",
        success: false,
      });
    }

    //Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    req.body.password = hashedPassword;

    //Register user
    const user = new UserModel(req.body);
    await user.save();
    return res.status(201).json({
      user,
      success: true,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error!",
      success: false,
      error: err.message,
    });
  }
};

//*************** USER LOGIN **********/
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //Validation
    if (!email || !password) {
      return res.status(422).json({
        message: "Please provide all fields!",
        success: false,
      });
    }

    //Password Validation
    if (password.length < 6) {
      return res.status(422).json({
        message: "Password length should be greater than 6 character",
        success: false,
      });
    }

    //Check user is exist or not
    const getUser = await UserModel.findOne({ email });
    if (!getUser) {
      return res.status(404).json({
        message: "Invalid Credentials!",
        success: false,
      });
    }

    //Password match
    const comparePassword = await bcrypt.compare(password, getUser.password);
    if (!comparePassword) {
      return res.status(400).json({
        message: "Incorrect Password, Please check again...",
        success: false,
      });
    }

    //Generate token
    const token = jwt.sign({ id: getUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    //Login success
    return res.status(200).json({
      success: true,
      token,
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error!",
      success: false,
      error: err.message,
    });
  }
};

//********* GET USER INFO (FOR PROTECTED ROUTES) ******/
export const getUserInfo = async (req, res, next) => {
  try {
    //Get user
    const user = await UserModel.findOne({ _id: req.body.userId });
    if (!user) {
      return res.status(404).json({
        message: "User doesn't exists!",
        success: false,
      });
    }

    //Success response
    return res.status(200).json({
      success: true,
      data: {
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error!",
      success: false,
      error: err.message,
    });
  }
};