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

const getUsers = () => {
  const users = loadUsers();
  return users;
};

const getUser = (passportID) => {
  const users = loadUsers();
  const userIndex = checkUserExistence(users, passportID);
  return users[userIndex];
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

// basically in this function i use a mix of withraw & deposit = withdraw for the sending user and deposit for the receiving one.
// in case of an error in withdraw, it throws error so the function doesnt proceed to deposit part.
// in case of an error in deposit, I catch the error and deposit the withdrawn amount of money back to the sending user.
const transfer = (userPassportID, userToTransferID, amount) => {
  let sendingUserAfterWithdraw = updateUserAmount(
    userPassportID,
    amount,
    "cash",
    "withdraw"
  );
  console.log("here");
  let receivingUserAfterDeposit;
  try {
    receivingUserAfterDeposit = updateUserAmount(
      userToTransferID,
      amount,
      "cash",
      "deposit"
    );
  } catch (error) {
    sendingUserAfterWithdraw = updateUserAmount(
      userPassportID,
      amount,
      "cash",
      "deposit"
    );
    throw new Error(error.message);
  }
  return [sendingUserAfterWithdraw, receivingUserAfterDeposit];
};

const filterUsersBy = (amount, prop) => {
  const users = loadUsers();
  const filteredUsers = users.filter((user) => user[prop] > amount);
  return filteredUsers;
};

const sortUsersBy = (sortBy, orderBy) => {
  const users = loadUsers();
  console.log(sortBy);
  if (users.length > 0 && users[0].hasOwnProperty(sortBy)) {
    const sortedUsers = users.sort((user1, user2) =>
      orderBy === "desc"
        ? user2[sortBy] - user1[sortBy]
        : user1[sortBy] - user2[sortBy]
    );
    return sortedUsers;
  } else {
    throw new Error("users dont have such props...");
  }
};

// private methods for checking validation, loading and saving users.

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
    throw new Error("User already exists.");
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

module.exports = {
  createUser,
  updateUserAmount,
  transfer,
  getUser,
  getUsers,
  filterUsersBy,
  sortUsersBy,
};
