const fs = require("fs");
const USERS_PATH = __dirname + "/bankUsersData/bank-users.json";
const bankUsers = require(USERS_PATH);

const createUser = (newUser) => {
  const currentUsers = loadUsers();
  if (
    checkUserValidation(currentUsers, newUser) &&
    checkValidPassport(newUser)
  ) {
    currentUsers.push({ ...newUser, cash: 0, credit: 0 });
    saveUsers(currentUsers);
  }
  return currentUsers;
};

const updateUserAmount = (userPassportID, amount, toUpdate, mode) => {
  const currentUsers = loadUsers();
  const userIndex = checkUserExistence(currentUsers, userPassportID);
  const user = currentUsers[userIndex];
  const amountNum = Number(amount);
  const userAmount = Number(user[toUpdate]);
  if (checkPositiveNumber(amountNum)) {
    let sum;
    if (mode === "deposit") {
      sum = userAmount + amountNum;
    } else if (mode === "withdraw") {
      if (checkWithdraw(user, userAmount, amountNum)) {
        sum = userAmount - amountNum;
      }
    }
    currentUsers.splice(userIndex, 1, { ...user, [toUpdate]: sum });
    saveUsers(currentUsers);
    return currentUsers[userIndex];
  }
};

const transfer = (userPassportID, userToTransferID, amount) => {
  const sendingUserAfterWithdraw = updateUserAmount(
    userPassportID,
    amount,
    "cash",
    "withdraw"
  );
  console.log("here");
  const receivingUserAfterDeposit = updateUserAmount(
    userToTransferID,
    amount,
    "cash",
    "deposit"
  );

  return [sendingUserAfterWithdraw, receivingUserAfterDeposit];
};

const checkWithdraw = (user, userAmount, amountNum) => {
  if (userAmount > 0 && user.credit * -1 <= userAmount - amountNum) {
    return true;
  } else {
    throw new Error(
      `cant complete the operation. amount is out of credit limit, id ${user["passportID"]}`
    );
  }
};

const loadUsers = () => {
  const usersBuffer = fs.readFileSync(USERS_PATH);
  const usersData = JSON.parse(usersBuffer);
  return usersData;
};

const saveUsers = (users) => {
  const usersString = JSON.stringify(users);
  fs.writeFileSync(USERS_PATH, usersString);
};

const checkUserValidation = (currentUsers, userToValidate) => {
  if (
    userToValidate &&
    currentUsers.filter((user) => user.passportID === userToValidate.passportID)
      .length === 0
  ) {
    return true;
  } else {
    throw new Error(
      "new User doesn't exist or already exists. check new User data carefully"
    );
  }
};

const checkValidPassport = (userToCheck) => {
  if (
    userToCheck.passportID.length === 9 &&
    userToCheck.passportID.search(/\D/) === -1
  ) {
    return true;
  } else {
    throw new Error(
      "incorrect passportID format, check that it has 9 digits and digits only."
    );
  }
};

const checkUserExistence = (users, userID) => {
  const userIndex = users.findIndex((user) => user.passportID === userID);
  if (userIndex > -1) {
    return userIndex;
  } else {
    throw new Error(`a User with the id of ${userID} hasn't found`);
  }
};

const checkPositiveNumber = (numberToCheck) => {
  if (numberToCheck > 0) {
    return true;
  } else {
    throw new Error("amount is not a (Positive) Number!");
  }
};

module.exports = { createUser, updateUserAmount, transfer };
