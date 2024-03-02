import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { UserDocument, User } from "../models/User";

export default async function login(req: Request, res: Response) {
  const { username, password } = req.body;
  try {
    const user: UserDocument | null = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      res.status(400).send({ message: "Invalid username or password" });
    } else {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "secret");
      res.status(200).send({ user: { username: username, password: user.password }, token: token });
    }
  } catch (error) {
    res.status(500).send(error);
  }
}