import mongoose, { Document, Model } from "mongoose";
const { Schema, model, models } = mongoose;

export interface UserDocument extends Document {
  username: string,
  password: string,
  communities: Array<string>,
}

// const userCaseSchema = new Schema<userCaseAttrs>({
//   caseID: {
//     type: String,
//   },
//   role: {
//     type: String,
//   },
// });

const userSchema = new Schema<UserDocument>(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: false,
    },
    communities: {
        type: Array<String>,
        required: false
    }
  },
  { timestamps: true }  
);

export const User: Model<UserDocument> = models.User
  ? (models.User as Model<UserDocument>)
  : model<UserDocument>("User", userSchema);
