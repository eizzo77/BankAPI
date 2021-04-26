// require("dotenv");
const mongoose = require("mongoose");

const atlasURL =
  "mongodb+srv://ItayZaguri:togZzih3VqZBqthG@cluster0.df8aj.mongodb.net/Bank-Api?retryWrites=true&w=majority";

console.log("in mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(atlasURL, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    console.log("connected To Mongo");
  } catch (error) {
    console.log(error);
  }
};

module.exports = connectDB;
