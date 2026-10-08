import mongoose, { Document, Model, Schema } from "mongoose";

export interface IEmailVerification extends Document {
  name: string;
  email: string;
  passwordHash: string;
  otpHash: string;
  expiresAt: Date;
}

const EmailVerificationSchema =
  new Schema<IEmailVerification>(
    {
      name: {
        type: String,
        required: true,
      },

      email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
      },

      passwordHash: {
        type: String,
        required: true,
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

const EmailVerification: Model<IEmailVerification> =
  mongoose.models.EmailVerification ||
  mongoose.model<IEmailVerification>(
    "EmailVerification",
    EmailVerificationSchema
  );

export default EmailVerification;