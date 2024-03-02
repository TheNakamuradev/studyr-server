import mongoose, { Document, Model } from "mongoose";

const { Schema, model, models } = mongoose;

export interface CommunityDocument extends Document {
  name: string;
  description: string;
  admin: Array<string>;
  users: Array<string>;
}

const communitySchema = new Schema<CommunityDocument>(
  {
    name: {
      type: String,
      unique: true,
      required: true
    },
    description: {
      type: String
    },
    admin: [
      {
        type: String,
        required: true
      }
    ],
    users: [
      {
        type: String,
        required: true
      }
    ]
  },
  { timestamps: true }
);

export const Community: Model<CommunityDocument> = models.Community
  ? (models.Community as Model<CommunityDocument>)
  : model<CommunityDocument>("Community", communitySchema);
