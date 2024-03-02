import mongoose, { Document, Model } from "mongoose";

const { Schema, model, models } = mongoose;

interface SessionDocument extends Document {
  name: string;
}

export interface CommunityDocument extends Document {
  name: string;
  description: string;
  admin: Array<string>;
  users: Array<string>;
  Sessions: Array<SessionDocument>;
}

const sessionSchema = new Schema<SessionDocument>(
  {
    name: {
      type: String,
      required: true
    },
    _id: {
      type: Schema.Types.ObjectId,
      ref: "Session"
    }
  },
  { timestamps: true }
);

const communitySchema = new Schema<CommunityDocument>(
  {
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    admin: [
      {
        type: Schema.Types.ObjectId,
        unique: true,
        required: true
      }
    ],
    users: [
      {
        type: Schema.Types.ObjectId,
        unique: true,
        required: true
      }
    ],
    Sessions: [
      {
        type: sessionSchema,
        unique: true
      }
    ]
  },
  { timestamps: true }
);

export const Community: Model<CommunityDocument> = models.Community
  ? (models.Community as Model<CommunityDocument>)
  : model<CommunityDocument>("Community", communitySchema);
