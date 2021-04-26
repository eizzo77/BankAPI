const express = require("express");
const router = new express.Router();
const User = require("../model/user");
const utils = require("../utils");

router.post("/api/users", async (req, res) => {
  console.log("Posting a new User...");
  const user = new User({ _id: req.body.passportID, ...req.body });
  try {
    await user.save();
    console.log(user);
    res.status(201).send(user);
  } catch (error) {
    res.send(error.message);
  }
});

router.patch("/api/users/:passportID/deposit", async (req, res) => {
  console.log("depositing");
  try {
    const { passportID } = req.params;
    const amount = req.body.cash;
    const user = await User.findById(passportID);
    const updatedUser = await utils.updateUserAmount(
      user,
      amount,
      "cash",
      "deposit"
    );

    console.log(updatedUser);
    updatedUser ? res.status(200).send(updatedUser) : res.status(404).send();
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.patch("/api/users/:passportID/withdraw", async (req, res) => {
  console.log("withdraws");
  try {
    const { passportID } = req.params;
    const amount = req.body.cash;
    const user = await User.findById(passportID);
    utils.checkWithdraw(user, amount);
    const updatedUser = await utils.updateUserAmount(
      user,
      amount,
      "cash",
      "withdraw"
    );
    console.log(updatedUser);
    updatedUser ? res.status(200).send(updatedUser) : res.status(404).send();
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.patch("/api/users/:passportID/setActive", async (req, res) => {
  console.log("setting user active/inactive");
  try {
    const { passportID } = req.params;
    const userAfterToggle = await utils.toggleActive(passportID);
    userAfterToggle
      ? res.status(200).send(userAfterToggle)
      : res.status(404).send();
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});

router.get("/api/users/filter", async (req, res) => {
  console.log("filtering by amount over specified amount...");
  try {
    const { amountAbove } = req.query;
    const { prop } = req.query;
    const filteredUsers = await utils.filterUsersBy(amountAbove, prop);
    res.status(200).send(filteredUsers);
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});

router.get("/api/users/filterActivity", async (req, res) => {
  try {
    const { isActive } = req.query;
    const { amount } = req.query;
    const filteredUsers = await utils.filterUsersByActivity(isActive, amount);
    res.status(200).send(filteredUsers);
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});

router.get("/api/users/sort", async (req, res) => {
  console.log("sorting by a prop...");
  try {
    const { sortBy } = req.query;
    const { orderBy } = req.query;
    const sortedUsers = await utils.sortUsersBy(sortBy, orderBy);
    res.status(200).send(sortedUsers);
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});

router.get("/api/users/:passportID", async (req, res) => {
  console.log("getting...");
  try {
    const { passportID } = req.params;
    const userToGet = await utils.getUser(passportID);
    console.log(userToGet);
    res.send(userToGet);
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});

router.get("/api/users", async (req, res) => {
  console.log("getting all users..");
  try {
    const users = await utils.getUsers();
    res.status(200).send(users);
  } catch (error) {
    res.send({ error: error.message });
  }
});

module.exports = router;
