const mongoose =require('mongoose');

async function dbConnect() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to MongoDB");
  } catch (error) {
    throw new Error("Connection failed!");
  }
}
module.exports={dbConnect}