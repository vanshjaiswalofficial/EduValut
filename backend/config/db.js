import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    // Disable command buffering so queries fail immediately instead of hanging when disconnected
    mongoose.set('bufferCommands', false);
    
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`\n================================================================`);
    console.error(`DATABASE CONNECTION WARNING: ${error.message}`);
    console.error(`EduVault is running, but database features will be disabled.`);
    console.error(`Please verify that MongoDB is running locally or specify a`);
    console.error(`valid MONGODB_URI (e.g., MongoDB Atlas) in your backend/.env file.`);
    console.error(`================================================================\n`);
  }
};

export default connectDB;

