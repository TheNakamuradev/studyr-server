import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { CommunityDocument, Community } from "../../models/Community";
import { UserDocument, User } from "../../models/User";

export default async function getCommunityInfo(req: Request, res: Response) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).send({ message: "Unauthorized Access" });
    return;
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || "secret") as {
      userId: string;
    };
    if (!(await User.findById(decodedToken.userId))) {
      res.status(403).send({ message: "Unauthorised Access" });
      return;
    }
    const communityId = req.query.communityId;
    const community = await Community.findById(communityId);
    if (!community) {
      res.status(404).send({ status: "error", message: "Community Not Found" });
      return;
    }

    res.status(200).send({
      communityId,
      name: community.name,
      description: community.description,
      admin: community.admin,
      users: community.users
    });
  } catch (error: any) {
    console.log(error.message);
    res.status(404).send({ status: "error", message: "Community Not Found" });
  }
}
