const mongoose = require("mongoose");

atlasURL =
  "  mongodb://ItayZaguri:togZzih3VqZBqthG>@cluster0-shard-00-00.df8aj.mongodb.net:27017,cluster0-shard-00-01.df8aj.mongodb.net:27017,cluster0-shard-00-02.df8aj.mongodb.net:27017/Bank-Api?ssl=true&replicaSet=atlas-nu2xpg-shard-0&authSource=admin&retryWrites=true&w=majority";
mongoose
  .connect(atlasURL, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("connected to MongoDBAtlas"))
  .catch((error) => console.log(error));
