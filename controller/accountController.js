import { db } from '../models/db.js';

const accountModel = db.model;

export const getAccounts = async () => {
  const arr = await accountModel.find({}, { _id: 0 });
  // console.log(arr);
  return arr;
};

export const doDeposit = async (agencia, conta, deposit) => {
  const acc = await accountModel.findOneAndUpdate(
    { agencia: agencia, conta: conta },
    { $inc: { balance: deposit } },
    { new: true, useFindAndModify: false }
  );

  if (acc !== null) {
    return acc;
  } else {
    throw new Error('Account not found. Check parameters');
  }
};

export const doWithdraw = async (agencia, conta, value) => {
  let acc = await accountModel.findOne(
    { agencia: agencia, conta: conta },
    { _id: 0 }
  );

  if (acc === null) {
    throw new Error('Account not found. Check parameters');
  } else if (acc.balance - value - 1 < 0) {
    throw new Error(`Insufficient Funds. Available Balance: ${acc.balance})`);
  }
  acc.balance = acc.balance - value - 1;
  const updatedAcc = await accountModel.findOneAndUpdate(
    { agencia: agencia, conta: conta },
    { balance: acc.balance },
    { new: true, useFindAndModify: false }
  );
  return updatedAcc;
};

export const getBalance = async (ag, cc) => {
  const acc = await accountModel.findOne({ agencia: ag, conta: cc });

  if (acc !== null) {
    return acc.balance;
  } else {
    throw new Error('Account not found. Check parameters');
  }
};

export const deleteAccount = async (ag, cc) => {
  const deletedAcc = await accountModel.findOneAndDelete({
    agencia: ag,
    conta: cc,
  });

  if (deletedAcc === null) {
    throw new Error('Account not found. Check parameters');
  }
  const sameAgAccs = await accountModel.find({ agencia: ag });
  return sameAgAccs.length;
};

export const doTransfer = async (origin, recipient, ammount) => {
  const originAcc = await accountModel.findOne({ conta: origin });
  if (originAcc === null) {
    throw new Error('Origin account not found. Check parameters');
  }
  const recipientAcc = await accountModel.findOne({ conta: recipient });
  if (recipientAcc === null) {
    throw new Error('Recipient account not found. Check parameters');
  }

  let ammountFromOrigin = ammount;
  if (originAcc.agencia !== recipientAcc.agencia) {
    ammountFromOrigin = ammountFromOrigin + 8;
  }

  if (originAcc.balance - ammountFromOrigin < 0) {
    throw new Error(
      `Insufficient funds for origin account. Available balance is ${originAcc.balance}`
    );
  }

  const updatedOriginAcc = await accountModel.findOneAndUpdate(
    { conta: origin },
    { $inc: { balance: -ammountFromOrigin } },
    { new: true, useFindAndModify: false }
  );
  const updatedRecipientAcc = await accountModel.findOneAndUpdate(
    { conta: recipient },
    { $inc: { balance: ammount } },
    { new: true, useFindAndModify: false }
  );

  return [updatedOriginAcc.balance, updatedRecipientAcc.balance];
};

export const getAvgBalance = async (ag) => {
  const avgBalance = await accountModel.aggregate([
    { $match: { agencia: parseInt(ag) } },
    {
      $group: {
        _id: '$agencia',
        avgBal: { $avg: '$balance' },
      },
    },
    { $project: { _id: 0 } },
  ]);

  if (avgBalance.length === 0) {
    throw new Error('No accounts for this agency. Check parameters.');
  }

  return avgBalance[0].avgBal;
};

export const getAccountsList = async (limit, order) => {
  const accounts = await accountModel.find(
    {},
    { _id: 0 },
    { sort: { balance: order, name: 1 }, limit: parseInt(limit) }
  );

  return accounts;
};

export const doTransferToPrivate = async () => {
  let transferedClients = [];
  const accounts = await accountModel.aggregate([
    { $sort: { balance: -1 } },
    { $project: { _id: 0 } },
    {
      $group: {
        _id: '$agencia',
        accounts: {
          $first: '$$ROOT',
        },
      },
    },
    {
      $project: {
        _id: 0,
        agencia: '$accounts.agencia',
        conta: '$accounts.conta',
        name: '$accounts.name',
        balance: '$accounts.balance',
      },
    },
  ]);

  for (const account of accounts) {
    const { agencia, conta } = account;
    if (agencia === 99) continue;

    const isUpdated = await accountModel.updateOne(
      { agencia: agencia, conta: conta },
      { $set: { agencia: 99 } }
    );
    transferedClients.push(account);
  }

  const clientsOfPrivate = await accountModel.find({ agencia: 99 });
  return [clientsOfPrivate, transferedClients];
};

export const createAcc = async (account) => {
  const { agencia, conta, name, balance } = account;

  const searchAg = await accountModel.findOne({ conta: conta });
  if (searchAg !== null) {
    throw new Error("Couldn't create new account. Account already exists");
  }

  const newAcc = new accountModel({
    agencia: parseInt(agencia),
    conta: parseInt(conta),
    name,
    balance: parseInt(balance),
  });
  let savedAcc = await newAcc.save();
  delete savedAcc._doc._id;

  return savedAcc._doc;
};
