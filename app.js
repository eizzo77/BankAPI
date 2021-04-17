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

app.put("/api/users/:passportID", (req, res, next) => {
  console.log("puting/depositing cash to a User");
  try {
    const { passportID } = req.params;
    const prop = Object.keys(req.query)[0];
    const amount = req.query[prop];
    const usersAfterDeposit = utils.deposit(passportID, amount, prop);
    res.send(usersAfterDeposit);
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});
