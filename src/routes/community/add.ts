import { Request, Response } from "express";
import jwt from "jsonwebtoken";

import { CommunityDocument, Community } from "../../models/Community";

export default async function addUser(req: Request, res: Response) {
  const { id } = req.body; // Extracting 'id' from the request body
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    res.status(401).send({ message: "Unauthorized Access" });
    return;
  }
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET || "secret") as {userId: string}

    const community: CommunityDocument | null = await Community.findById(decodedToken.userId);
    if (!community) {
      res.status(401).send({ message: "Unauthorized Access" });
      return;
    }
    // ==
    
  // Append the ID to the users list in the community
  community.users.push(id);
  await community.save(); // Save the updated community document

  res.status(200).send({ message: "ID appended to users list in the community" });
  } catch (error) {
    res.status(500).send({ status: "error", message: "Internal Server Error" });
  }
}
