// models/WasteCollection.js
import { Schema, model } from 'mongoose';

const wasteCollectionSchema = new Schema({
  collectedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  collectionDate: { type: Date, default: Date.now },
  location: { type: String, required: true },
  wasteType: { type: String, required: true },
  quantity: { type: Number, required: true },
  status: { type: String, default: 'pending' },
  missed: { type: Boolean, default: false },
  assignedPersonnel: { type: Schema.Types.ObjectId, ref: 'User' }, // Add this field
}, {
  timestamps: true,
});

const WasteCollection = model('WasteCollection', wasteCollectionSchema);
export default WasteCollection;

