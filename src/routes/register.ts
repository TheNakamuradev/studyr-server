import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { UserDocument, User } from "../models/User";

export default async function register(req: Request, res: Response) {
  const { name, username, password, login } = req.body as { name: string, username: string, password: string, login: boolean | undefined };
  try {
    const user: UserDocument = new User({ name, username, password });
    await user.save();
    if (login !== false) {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "secret");
      res.status(201).send({ user: { username, password: user.password }, token: token });
    } else {
      res.status(201).send({ user: { username, password: user.password } });
    }
  } catch (error) {
    console.log(error);
    res.status(409).send({ status: "error", message: "User Exists" });
  }
}
