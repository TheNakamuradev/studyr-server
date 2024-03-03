import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { UserDocument, User } from "../../models/User";

export default async function editTags(req: Request, res: Response) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).send({ message: "Unauthorized Access" });
    return;
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || "secret") as {
      userId: string;
    };
    const user: UserDocument | null = await User.findById(decodedToken.userId);

    if (!user) {
      res.status(404).send({ message: "User not Found" });
      return;
    }

    user.updateOne({ $set: { tags: req.body.tags } }).exec();

    res.status(200).send({
      username: user.username,
      tags: req.body.tags
    });
  } catch (error: any) {
    console.log(error.message);
    res.status(404).send({ status: "error", message: "User Not Found" });
  }
}
