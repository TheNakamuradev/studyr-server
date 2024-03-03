import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { UserDocument, User } from "../../models/User";
import { CommunityDocument, Community } from "../../models/Community";

export default async function createCommunity(req: Request, res: Response) {
  const { name, description, users } = req.body as { name: string; description: string; users: string[] }
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
      res.status(401).send({ message: "Unauthorized Access" });
      return;
    }
    const community: CommunityDocument = new Community({
      name,
      description,
      admin: [decodedToken.userId],
      users
    });

    user.updateOne({ $addToSet: { communities: { id: community._id, name, description } } }).exec();
    user.save();

    for (let i = 0; i < users.length; i++) {
      const user = await User.findById(users[i]);
      if (!user) {
        res.status(404).send({ message: `userId ${users[i]} not found` });
        return;
      } else {
        user
          .updateOne({
            $addToSet: {
              communities: {
                id: community._id,
                name: community.name,
                description: community.description
              }
            }
          })
          .exec();
        user.save();
      }
    }

    community.save();

    res.status(201).send({
      community: {
        id: community._id,
        name,
        description,
        admin: [decodedToken.userId],
        users
      }
    });
  } catch (error: any) {
    console.log(error.message);
    res.status(409).send({ status: "error", message: "Community Exists" });
  }
}
