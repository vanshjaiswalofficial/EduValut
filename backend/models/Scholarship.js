import mongoose from 'mongoose';

const scholarshipSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    provider: {
      type: String,
      required: true,
      trim: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['Pending', 'Submitted', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    applicationDate: {
      type: Date,
      default: Date.now,
    },
    documents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Document',
      },
    ],
    remarks: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Scholarship = mongoose.model('Scholarship', scholarshipSchema);
export default Scholarship;
