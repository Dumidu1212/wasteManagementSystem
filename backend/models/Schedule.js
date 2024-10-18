import { Schema, model } from 'mongoose';

const scheduleSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  scheduledDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'missed'],
    default: 'pending',
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Can be either Admin or User who created the schedule
  },
  area: {
    type: String,
    required: true,
  },
  notes: String,
}, {
  timestamps: true,
});

const Schedule = model('Schedule', scheduleSchema);
export default Schedule;
