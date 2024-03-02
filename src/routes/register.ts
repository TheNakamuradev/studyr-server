import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { UserDocument, User } from "../models/User";

export default async function register(req: Request, res: Response) {
  const { username, password } = req.body;
  const user: UserDocument = new User({ username, password });
  try {
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "secret");
    res.status(201).send({ user: { username: username, password: user.password }, token: token });
  } catch (error) {
    res.status(409).send({ status: "error", message: "User Exists" });
  }
}
