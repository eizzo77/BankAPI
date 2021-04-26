const express = require("express");
const router = new express.Router();
const Transaction = require("../model/transactions");
const utils = require("./utils");

router.post("/api/users/:passportID/transfer", async (req, res) => {
  console.log("transffering...");
  const { passportID } = req.params;
  const { transferTo } = req.query;
  const { amount } = req.query;
  console.log(transferTo);
  try {
    const usersAfterTransfer = await utils.transfer(
      passportID,
      transferTo,
      amount
    );
    const transfer = await new Transaction({
      sender: passportID,
      receiver: transferTo,
      transferAmount: amount,
    });
    await transfer.save();
    console.log(usersAfterTransfer);
    res.status(200).send({ transfer, usersAfterTransfer });
  } catch (error) {
    res.status(400).send({ error: error.message });
  }
});

router.get("/api/transactions", async (req, res) => {
  console.log("getting transactions...");
  try {
    const trans = await Transaction.find({});
    res.status(200).send(trans);
  } catch (error) {
    res.status(404).send({ error: error.message });
  }
});
