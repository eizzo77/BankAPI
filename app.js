const express = require("express");
const app = express();
require("./client/src/db/mongoose");
const utils = require("./utils");
var cors = require("cors");
const path = require("path");
const User = require("./client/src/model/User");
const Transaction = require("./client/src/model/transactions");

app.use(express.json());
app.use(cors());

const publicDirectory = path.join(__dirname, "client/build");
app.use(express.static(publicDirectory));

app.post("/users", async (req, res) => {
  console.log("Posting a new User...");
  const user = await new User({ _id: req.body.passportID, ...req.body });
  try {
    await user.save();
    console.log(user);
    res.status(201).send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.post("/api/users/:passportID/transfer", async (req, res) => {
  console.log("transffering...");
  const transfer = await new Transaction({
    sender: req.params.passportID,
    receiver: req.query.transferTo,
    transferAmount: req.query.amount,
    ...req.body,
  });
  try {
    // const updatedUsersAfterTransfer = utils.transfer(
    //   passportID,
    //   transferTo,
    //   amount
    // );
    await transfer.save();
    res.status(200).send(transfer);
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.patch("/api/users/:passportID/deposit", async (req, res) => {
  console.log("depositing");
  try {
    const { passportID } = req.params;
    const amount = req.body.cash;
    const userAfterUpdate = await User.findByIdAndUpdate(
      passportID,
      {
        $inc: { cash: amount },
      },
      {
        new: true,
        runvalidators: true,
      }
    );
    console.log(userAfterUpdate);
    userAfterUpdate
      ? res.status(200).send(userAfterUpdate)
      : res.status(404).send();
    console.log();
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.patch("/api/users/:passportID/withdraw", async (req, res) => {
  console.log("withdraws");
  try {
    const { passportID } = req.params;
    const amount = req.body.cash;
    const user = await User.findById(passportID);
    utils.checkWithdraw(user, amount);
    const updatedUser = await User.findOneAndUpdate(
      { _id: passportID },
      {
        $inc: { cash: -amount },
      },
      {
        new: true,
      }
    );
    console.log(updatedUser);
    updatedUser ? res.status(200).send(updatedUser) : res.status(404).send();
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

app.put("/api/users/:passportID/setActive", (req, res, next) => {
  console.log("setting user active/inactive");
  try {
    const { passportID } = req.params;
    const userAfterToggle = utils.toggleActive(passportID);
    res.status(200).send(userAfterToggle);
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});

app.get("/api/users/:passportID", (req, res, next) => {
  console.log("getting...");
  try {
    const { passportID } = req.params;
    const userToGet = utils.getUser(passportID);
    res.send(userToGet);
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});

app.get("/api/users", (req, res, next) => {
  if (Object.keys(req.query).length > 0) {
    next();
  } else {
    console.log("getting all users..");
    try {
      const users = utils.getUsers();
      res.status(200).send(users);
    } catch (error) {
      res.status(404).send({ error: error.message });
    }
  }
});

app.get("/api/users", (req, res, next) => {
  if (req.query["amountAbove"]) {
    console.log("filtering by amount over specified amount...");
    try {
      const { amountAbove } = req.query;
      const { prop } = req.query;
      const filteredUsers = utils.filterUsersBy(amountAbove, prop);
      res.status(200).send(filteredUsers);
    } catch (error) {
      res.status(404).send({ error: error.message });
    }
  } else {
    next();
  }
});

app.get("/api/users", (req, res, next) => {
  if (req.query["isActive"]) {
    console.log("getting users by activity and amount...");
    try {
      const { isActive } = req.query;
      const { amount } = req.query;
      const filteredUsers = utils.filterUsersByActivity(isActive, amount);
      res.status(200).send(filteredUsers);
    } catch (error) {
      res.status(404).send({ error: error.message });
    }
  } else {
    next();
  }
});

app.get("/api/users", (req, res, next) => {
  console.log("sorting by a prop...");
  try {
    const { sortBy } = req.query;
    const { orderBy } = req.query;
    const sortedUsers = utils.sortUsersBy(sortBy, orderBy);
    res.status(200).send(sortedUsers);
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});

const PORT = process.env.PORT || 8083;

app.listen(PORT, () => {
  console.log(`Listening on port #${PORT}`);
});
