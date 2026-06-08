import mongoose from 'mongoose';

const documentSchema = new mongoose.Schema(
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
    url: {
      type: String,
      required: true,
    },
    firebaseStoragePath: {
      type: String,
      required: true,
    },
    fileType: {
      type: String,
      enum: ['pdf', 'jpg', 'jpeg', 'png'],
      required: true,
    },
    category: {
      type: String,
      enum: ['Academic', 'Scholarship', 'Financial', 'Personal'],
      required: true,
      index: true,
    },
    subCategory: {
      type: String,
      required: true,
      trim: true,
    },
    fileSize: {
      type: Number, // in bytes
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Document = mongoose.model('Document', documentSchema);
export default Document;
