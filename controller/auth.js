// npm modules
import jwt from "jsonwebtoken";
import "dotenv/config";

// my modules
import User from "../service/schemas/user.js";

const secret = process.env.SECRET;

export const register = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const newUser = new User({ name, email });
    await newUser.setPassword(password);
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    next(error);
    console.log(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user || !(await user.validatePassword(password))) {
      return res
        .status(401)
        .json({ message: "Email or password is incorrect" });
    }

    const payload = {
      id: user._id,
      email: user.email,
    };

    const token = jwt.sign(payload, secret, { expiresIn: "3d" });

    user.token = token;
    await user.save();

    res.json({
      token,
      user: {
        name: user.name,
        email: user.email,
        subscription: user.subscription,
      },
    });
  } catch (error) {
    next(error);
    console.log(error);
  }
};