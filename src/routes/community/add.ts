import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { CommunityDocument, Community } from "../../models/Community";
import { UserDocument, User } from "../../models/User";

export default async function addUser(req: Request, res: Response) {
  const { communityId, users } = req.body as { communityId: string; users: string[] }
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).send({ message: "Unauthorized Access" });
    return;
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || "secret") as {
      userId: string;
    };

    const community = await Community.findById(communityId);
    if (!community) {
      res.status(404).send({ message: "Community not found" });
      return;
    } else if (String(community.admin) !== (decodedToken.userId)) {
      res.status(403).send({ message: "Access Forbidden. Not an Admin" });
      return;
    }
    community.updateOne({ $addToSet: { users } }).exec();
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
                id: communityId,
                name: community.name,
                description: community.description
              }
            }
          })
          .exec();
        user.save();
      }
    }
    const updatedCommunity = await Community.findById(communityId);
    if (!updatedCommunity) {
      res.status(400).send({ message: "Error" });
      return;
    }

    community.save();

    res
      .status(200)
      .send({ communityId: community._id, name: community.name, users: updatedCommunity.users });
  } catch (error) {
    res.status(500).send({ status: "error", message: "Internal Server Error" });
  }
}
