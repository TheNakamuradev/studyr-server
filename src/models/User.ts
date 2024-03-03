import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcrypt";

const { model, models } = mongoose;

interface CommunityInfoDocument extends Document {
  id: Schema.Types.ObjectId;
  name: string;
  description: string;
}

export interface UserDocument extends Document {
  name: string;
  username: string;
  password: string;
  tags: Array<string>;
  communities: Array<CommunityInfoDocument>;
  comparePassword: (password: string) => Promise<boolean>;
}

const communityInfoSchema = new Schema<CommunityInfoDocument>(
  {
    id: {
      type: Schema.Types.ObjectId,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    description: {
      type: String
    }
  },
  { _id: false }
);

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true
    },
    username: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },
    tags: [
      {
        type: String
      }
    ],
    communities: [
      {
        type: communityInfoSchema
      }
    ]
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

export const User: Model<UserDocument> = models.User
  ? (models.User as Model<UserDocument>)
  : model<UserDocument>("User", userSchema);
