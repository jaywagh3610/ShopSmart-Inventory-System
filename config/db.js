const mongoose = require("mongoose");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config({ path: path.join(__dirname, "../config/config.env") });
const DATABASE = process.env.DATABASE;

const connectDb = async () => {
  try {
    const con = await mongoose.connect(DATABASE);
    console.log("Database is connected");
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
};

module.exports = connectDb;
