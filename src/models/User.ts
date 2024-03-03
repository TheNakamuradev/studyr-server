import mongoose, { Document, Model } from "mongoose";
import bcrypt from "bcrypt";

const { Schema, model, models } = mongoose;

export interface UserDocument extends Document {
  events: any;
  username: string;
  password: string;
  tags: Array<string>;
  communities: Array<string>;
  comparePassword: (password: string) => Promise<boolean>;
}

const userSchema = new Schema<UserDocument>(
  {
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
        type: Schema.Types.ObjectId,
        ref: "Community"
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
