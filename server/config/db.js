// Importing the ODM - mongoose library to interact with MongoDB
import mongoose from "mongoose";

// Asynchronous function to connect to MongoDB
const connectDB = async () => {
  try {
    // Attempt to connect using the connection string from environment variables
    const dbConnection = await mongoose.connect(process.env.MONGO_URI);

    // If successful, log the connected host
    console.log(
      `MongoDB connection successful:${dbConnection.connection.host}`
    );
  } catch (error) {
    // If connection fails, log the error and exit the process
    console.error("MongoDB connection failed:", error.message);
    process.exit(1); // Exit with failure code
  }
};

export default connectDB;
