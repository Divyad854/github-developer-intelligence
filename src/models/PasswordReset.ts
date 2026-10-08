import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export interface IPasswordReset extends Document {
  email: string;
  otpHash: string;
  expiresAt: Date;
}

const PasswordResetSchema =
  new Schema<IPasswordReset>(
    {
      email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
      },

      otpHash: {
        type: String,
        required: true,
      },

      expiresAt: {
        type: Date,
        required: true,
        expires: 0,
      },
    },
    {
      timestamps: true,
    }
  );

const PasswordReset: Model<IPasswordReset> =
  mongoose.models.PasswordReset ||
  mongoose.model<IPasswordReset>(
    "PasswordReset",
    PasswordResetSchema
  );

export default PasswordReset;