const express = require("express");
const app = express();
const utils = require("./utils");
var cors = require("cors");
const path = require("path");

app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 8083;

app.listen(PORT, () => {
  console.log(`Listening on port #${PORT}`);
});

const publicDirectory = path.join(__dirname, "client/build");
app.use(express.static(publicDirectory));

app.post("/api/users/:passportID", (req, res, next) => {
  console.log("Posting a new User...");
  try {
    const { passportID } = req.params;
    const newUser = { passportID: passportID };
    console.log(newUser);
    const users = utils.createUser(newUser);
    res.status(200).send(users);
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});

// deposit and update user's credit has the same functionallity. so I made this one func that deals with both cases.
app.put("/api/users/:passportID", (req, res, next) => {
  console.log("puting");
  try {
    const { passportID } = req.params;
    const prop = Object.keys(req.query)[0];
    const amount = req.query[prop];
    const updatedUser = utils.updateUserAmount(
      passportID,
      amount,
      prop,
      "deposit"
    );
    res.status(200).send(updatedUser);
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});

//same here, I can use same function to deal with withdraw and deposit. i made a mode parameter "deposit" or "withdraw".
app.put("/api/users/:passportID/withdraw", (req, res, next) => {
  console.log("withdraws");
  try {
    const { passportID } = req.params;
    const { cash } = req.query;
    const updatedUser = utils.updateUserAmount(
      passportID,
      cash,
      "cash",
      "withdraw"
    );
    res.status(200).send(updatedUser);
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});

app.put("/api/users/:passportID/transfer", (req, res, next) => {
  console.log("transffering...");
  try {
    const { passportID } = req.params;
    const { transferTo } = req.query;
    const { amount } = req.query;
    const updatedUsersAfterTransfer = utils.transfer(
      passportID,
      transferTo,
      amount
    );
    res.status(200).send(updatedUsersAfterTransfer);
  } catch (error) {
    res.status(404).send({ error: error.message });
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
