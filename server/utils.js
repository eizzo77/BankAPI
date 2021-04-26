const User = require("./model/user");

const createUser = (newUser) => {
  const currentUsers = loadUsers();
  if (
    checkUserValidation(currentUsers, newUser) &&
    checkValidPassport(newUser)
  ) {
    currentUsers.push({ ...newUser, cash: 0, credit: 0, isActive: "true" });
    saveUsers(currentUsers);
  }
  return currentUsers;
};

const getUsers = async () => {
  const users = await User.find({});
  return users;
};

const getUser = async (passportID) => {
  const user = await User.findById(passportID);
  return user;
};

const updateUserAmount = async (passportID, amount, toUpdate, mode) => {
  const userAfterUpdate = await User.findByIdAndUpdate(
    passportID,
    {
      $inc: {
        [toUpdate]:
          mode === "deposit"
            ? amount
            : checkWithdraw(user, amount)
            ? -amount
            : 0,
      },
    },
    {
      new: true,
      runvalidators: true,
    }
  );
  return userAfterUpdate;
};

const toggleActive = async (passportID) => {
  const user = await User.findById(passportID);
  const toggled = !user.isActive;
  const updatedUser = await User.findByIdAndUpdate(
    passportID,
    {
      isActive: toggled,
    },
    {
      new: true,
      runvalidators: true,
    }
  );
  console.log(updatedUser);
  return updatedUser;
};

// basically in this function i use a mix of withraw & deposit = withdraw for the sending user and deposit for the receiving one.
// in case of an error in withdraw, it throws error so the function doesnt proceed to deposit part.
// in case of an error in deposit, I catch the error and deposit the withdrawn amount of money back to the sending user.
const transfer = async (senderID, userToTransferID, amount) => {
  console.log(amount);
  let sendingUserAfterWithdraw = await updateUserAmount(
    senderID,
    amount,
    "cash",
    "withdraw"
  );
  console.log("here");
  let receivingUserAfterDeposit;
  try {
    receivingUserAfterDeposit = await updateUserAmount(
      userToTransferID,
      amount,
      "cash",
      "deposit"
    );
  } catch (error) {
    sendingUserAfterWithdraw = await updateUserAmount(
      senderID,
      amount,
      "cash",
      "deposit"
    );
    throw new Error(error.message);
  }
  console.log(sendingUserAfterWithdraw);
  return [sendingUserAfterWithdraw, receivingUserAfterDeposit];
};

const filterUsersBy = async (amount, prop) => {
  const users = await User.find({ [prop]: { $gte: amount } });
  console.log(users);
  return users;
};

const sortUsersBy = async (sortBy, orderBy) => {
  const users = await User.find({}).sort({ [sortBy]: orderBy });
  console.log(users);
  return users;
};

const filterUsersByActivity = (isActive, amount) => {
  const users = User.find({ isActive: isActive, cash: { $gte: amount } });
  return users;
};

// private methods for checking validation, loading and saving users.

const checkUserActive = (user) => {
  if (user.isActive) {
    return true;
  } else {
    throw new Error(`user with the id of ${user.passportID} is not Active`);
  }
};

const checkWithdraw = (user, amountNum) => {
  if (amountNum > 0) {
    if (user.credit * -1 <= user.cash - amountNum) {
      return true;
    } else {
      throw new Error(
        `cant complete the operation. amount is out of credit limit, id ${user._id}`
      );
    }
  } else {
    throw new Error("amount to withdraw must be a positive number");
  }
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
  toggleActive,
  filterUsersByActivity,
  checkWithdraw,
};
