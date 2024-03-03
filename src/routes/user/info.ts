import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { UserDocument, User } from "../../models/User";

export default async function getUserInfo(req: Request, res: Response) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).send({ message: "Unauthorized Access" });
    return;
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || "secret") as {
      userId: string;
    };
    const user: UserDocument | null = await User.findById(req.query.userId ?? decodedToken.userId);

    if (!user) {
      res.status(403).send({ message: "Unable to fetch User data" });
      return;
    }
    res
      .status(200)
      .send({ user: { username: user.username, tags: user.tags, communities: user.communities } });
  } catch (error: any) {
    console.log(error.message);
    res.status(404).send({ status: "error", message: "User Not Found" });
  }
}
