import { Schema, model } from 'mongoose';

const paymentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: [true, 'Please specify the payment amount'],
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    paymentMethod: {
      type: String,
      enum: ['credit_card', 'debit_card', 'paypal', 'bank_transfer', 'cash'],
      required: [true, 'Please specify the payment method'],
    },
    status: {
      type: String,
      enum: ['Pending', 'Completed', 'Failed'], // Ensure that the enum values are consistent in case usage
      default: 'Pending',
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  }
);

const Payment = model('Payment', paymentSchema);

export default Payment;
