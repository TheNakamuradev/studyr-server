import mongoose, { Document, Model, Schema } from "mongoose";

const { model, models } = mongoose;

interface SessionDocument extends Document {
  name: string;
}

export interface CommunityDocument extends Document {
  name: string;
  description: string;
  admin: Schema.Types.ObjectId;
  users: Array<string>;
  Sessions: Array<SessionDocument>;
}

const sessionSchema = new Schema<SessionDocument>(
  {
    name: {
      type: String,
      required: true
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
    admin: {
      type: Schema.Types.ObjectId,
      ref: "User"
    },
    users: [
      {
        type: Schema.Types.ObjectId,
        ref: "User"
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
