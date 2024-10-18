import { Schema, model } from 'mongoose';

const reportSchema = new Schema(
  {
    generatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    reportDate: {
      type: Date,
      default: Date.now,
    },
    reportType: {
      type: String,
      enum: ['monthly', 'annual', 'custom'],
      required: [true, 'Please specify the type of report'],
    },
    criteria: {
      type: String,
      required: [true, 'Please specify the criteria for the report'],
    },
    data: {
      type: Object, // Storing the report data as a JSON object
      required: [true, 'Please provide data for the report'],
    },
  },
  {
    timestamps: true,
  }
);

const Report = model('Report', reportSchema);

export default Report;
