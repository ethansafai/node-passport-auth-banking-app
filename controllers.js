const User = require("./models/User");
const Account = require("./models/Account");
const bcrypt = require("bcrypt");

const signup = async (req, res) => {
  const { firstName, lastName, age, username, password, income } = req.body;
  if (
    !firstName?.trim() ||
    !lastName?.trim() ||
    !age ||
    !username?.trim() ||
    !password?.trim() ||
    !income
  ) {
    res.render("index", { signupError: true });
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await new User({
      ...req.body,
      age: parseInt(age),
      password: hashedPassword,
    }).save();
    res.render("index", { userCreated: true });
  } catch {
    res.redirect("/");
  }
};

const getHome = async (req, res) => {
  const accounts = await Account.find({ user: req.user._id });
  res.render("home", { user: req.user, accounts });
};

const createAccount = async (req, res) => {
  try {
    const accounts = await Account.find({ user: req.user._id });
    const accountWithSameNameAndUser = await Account.findOne({
      user: req.user._id,
      name: req.body.name,
    });

    if (accountWithSameNameAndUser) {
      res.render("home", { user: req.user, accounts, sameNameError: true });
      return;
    }

    await new Account({
      ...req.body,
      user: req.user._id,
    }).save();

    const newAccounts = await Account.find({ user: req.user._id });

    res.render("home", {
      user: req.user,
      accountCreated: true,
      accounts: newAccounts,
    });
  } catch {
    res.redirect("/home");
  }
};

const deleteAccount = async (req, res) => {
  await Account.findByIdAndDelete(req.body.account);
  const accounts = await Account.find({ user: req.user._id });
  res.render("home", { accounts, user: req.user, accountDeleted: true });
};

const depositMoney = async (req, res) => {
  try {
    const account = await Account.findById(req.body.account);
    account.deposits.push({
      amount: req.body.amount,
      date: new Date(),
    });
    account.balance = account.balance + parseFloat(req.body.amount);
    await account.save();
    const accounts = await Account.find({ user: req.user._id });
    res.render("home", { user: req.user, accounts, deposited: true });
  } catch {
    res.redirect("/home");
  }
};

const transferMoney = async (req, res) => {
  try {
    const fromAccount = await Account.findById(req.body.account);
    const toAccount = await Account.findById(req.body.toAccount);

    const accounts = await Account.find({ user: req.user._id });

    if (!toAccount) {
      res.render("home", { accounts, user: req.user, toAccountError: true });
      return;
    }

    const amount = req.body.amount;
    if (amount > fromAccount.balance) {
      fromAccount.transactions.push({
        account: req.body.toAccount,
        received: false,
        amount: req.body.amount,
        date: new Date(),
        failed: true,
      });
      await fromAccount.save();

      res.render("home", { accounts, user: req.user, insufficientFunds: true });
      return;
    }

    if (fromAccount._id.toString() === toAccount._id.toString()) {
      res.render("home", {
        accounts,
        user: req.user,
        sameAccountTransferError: true,
      });
      return;
    }

    toAccount.balance = toAccount.balance + parseFloat(amount);
    fromAccount.balance = fromAccount.balance - parseFloat(amount);

    fromAccount.transactions.push({
      account: req.body.toAccount,
      received: false,
      amount: req.body.amount,
      date: new Date(),
      failed: false,
    });

    toAccount.transactions.push({
      account: req.body.account,
      received: true,
      amount: req.body.amount,
      date: new Date(),
      failed: false,
    });

    await toAccount.save();
    await fromAccount.save();

    const newAccounts = await Account.find({ user: req.user._id });

    res.render("home", {
      user: req.user,
      transferSuccess: true,
      accounts: newAccounts,
    });
  } catch {
    res.redirect("/home");
  }
};

const withdrawMoney = async (req, res) => {
  try {
    const accounts = await Account.find({ user: req.user._id });
    const account = await Account.findById(req.body.account);
    const amount = req.body.amount;

    if (amount > account.balance) {
      account.withdrawls.push({
        amount: req.body.amount,
        date: new Date(),
        failed: true,
      });
      await account.save();

      res.render("home", {
        accounts,
        user: req.user,
        withdrawInsufficientFunds: true,
      });
      return;
    }

    account.balance = account.balance - parseFloat(amount);
    account.withdrawls.push({
      amount: req.body.amount,
      date: new Date(),
      failed: false,
    });
    await account.save();

    const newAccounts = await Account.find({ user: req.user._id });

    res.render("home", {
      accounts: newAccounts,
      user: req.user,
      withdrawSuccess: true,
    });
  } catch {
    res.redirect("/home");
  }
};

module.exports = {
  signup,
  getHome,
  createAccount,
  deleteAccount,
  depositMoney,
  transferMoney,
  withdrawMoney,
};
