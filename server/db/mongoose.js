// require("dotenv").config();
const mongoose = require("mongoose");

mongoose.Promise = global.Promise;

const atlasURL =
  "mongodb+srv://ItayZaguri:togZzih3VqZBqthG@cluster0.df8aj.mongodb.net/Bank-Api?retryWrites=true&w=majority";

console.log("in mongoose");

mongoose
  .connect(atlasURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("connected To Mongo");
  })
  .catch((error) => console.log(error));
