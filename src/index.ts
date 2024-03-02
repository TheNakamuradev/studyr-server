import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { User, UserDocument } from "./models/User";
import mongoose from "mongoose";

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json()); // for parsing application/json

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

app.post("/register", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user: UserDocument = new User({ username, password });
  try {
    await user.save();
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "secret");
    res.status(201).send({ user: { username: username, password: password }, token: token });
  } catch (error) {
    res.status(400).send({ status: "error", message: "User Exists" });
  }
});

app.post("/login", async (req: Request, res: Response) => {
  const { username, password } = req.body;
  try {
    const user: UserDocument | null = await User.findOne({ username });
    if (!user || !(await user.comparePassword(password))) {
      res.status(400).send({ message: "Invalid username or password" });
    } else {
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "secret");
      res.status(200).send({ user: { username: username, password: password }, token: token });
    }
  } catch (error) {
    res.status(500).send(error);
  }
});

app.listen(port, () => {
  if (process.env.MONGO_URI !== null && process.env.MONGO_URI !== undefined) {
    try {
      mongoose.connect(process.env.MONGO_URI);
    } catch {
      console.log("Error connecting to the database");
      process.exit(1)
    }
    console.log(`[server]: Server is running at http://localhost:${port}`);
  } else {
    console.log("MONGO_URI is not defined in .env file. Exiting...")
    process.exit(1);
  }
});
