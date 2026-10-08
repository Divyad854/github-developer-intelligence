import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export interface IBlockedUser extends Document {
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BlockedUserSchema =
  new Schema<IBlockedUser>(
    {
      userId: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
      },
    },
    {
      timestamps: true,
    }
  );

const BlockedUser: Model<IBlockedUser> =
  mongoose.models.BlockedUser ||
  mongoose.model<IBlockedUser>(
    "BlockedUser",
    BlockedUserSchema
  );

export default BlockedUser;