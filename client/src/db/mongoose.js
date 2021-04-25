const mongoose = require("mongoose");

const atlasURL =
  "mongodb+srv://ItayZaguri:togZzih3VqZBqthG@cluster0.df8aj.mongodb.net/Bank-Api?retryWrites=true&w=majority";

mongoose
  .connect(atlasURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to MongoDBAtlas"))
  .catch((error) => console.log(error));
