const express = require("express");
const app = express();
const utils = require("./utils");

app.use(express.json());

const PORT = 8083;
app.listen(PORT, () => {
  console.log(`Listening on port #${PORT}`);
});

app.post("/api/users", (req, res, next) => {
  console.log("Posting a new User...");
  try {
    const users = utils.createUser(req.body);
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
    res.send(updatedUser);
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
    res.send(updatedUser);
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
    console.log(passportID);
    const updatedUsersAfterTransfer = utils.transfer(
      passportID,
      transferTo,
      amount
    );
    res.send(updatedUsersAfterTransfer);
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});
