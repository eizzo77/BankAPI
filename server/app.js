const connectDB = require("./db/mongoose");
const express = require("express");
var cors = require("cors");
// const path = require("path");
const app = express();
const userRouter = require("./routers/userRouter");
const transactionRouter = require("./routers/transactionRouter");
const PORT = process.env.PORT || 8084;
console.log("in app");
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(userRouter);
app.use(transactionRouter);

// app.use(express.static(path.join(__dirname, "../build")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../build"));
// });

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

const connection = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Listening on port #${PORT}`);
  });
};
connection();
