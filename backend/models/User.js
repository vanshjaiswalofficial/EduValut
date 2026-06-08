import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    firebaseUid: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
    },
    enrollmentNumber: {
      type: String,
      default: '',
    },
    collegeName: {
      type: String,
      default: '',
    },
    branch: {
      type: String,
      default: '',
    },
    semester: {
      type: Number,
      default: 1,
    },
    phoneNumber: {
      type: String,
      default: '',
    },
    profilePhoto: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
export default User;
