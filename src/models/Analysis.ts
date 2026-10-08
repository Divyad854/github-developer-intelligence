import mongoose, {
  Document,
  Model,
  Schema,
} from "mongoose";

export interface IAnalysis extends Document {
  username: string;
  avatar: string;
  by: string;
  createdAt: Date;
  updatedAt: Date;
}

const AnalysisSchema =
  new Schema<IAnalysis>(
    {
      username: {
        type: String,
        required: true,
      },

      avatar: {
        type: String,
        default: "",
      },

      by: {
        type: String,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

const Analysis: Model<IAnalysis> =
  mongoose.models.Analysis ||
  mongoose.model<IAnalysis>(
    "Analysis",
    AnalysisSchema
  );

export default Analysis;