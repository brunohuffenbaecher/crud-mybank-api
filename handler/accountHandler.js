import {
  createAcc,
  deleteAccount,
  doDeposit,
  doTransfer,
  doTransferToPrivate,
  doWithdraw,
  getAccounts,
  getAccountsList,
  getAvgBalance,
  getBalance,
} from '../controller/accountController.js';
import { db } from '../models/db.js';
import { logger } from '../helpers/logger.js';
import { validadeString, validateNumber } from '../helpers/validation.js';

export const handlerRoot = async (_, res) => {
  res
    .status(200)
    .send('Welcome to mybank-api. Use /account/ to perform operations');
};

export const handlerList = async (_, res) => {
  try {
    const accounts = await getAccounts();
    logger.info(`GET /account/list - Total accounts = ${accounts.length}`);
    res.status(200).send({ totalAccs: accounts.length, accounts: accounts });
  } catch (error) {
    logger.info(`GET /account/list - ${error.message}`);
    res.status(400).send(error.message);
  }
};

export const handlerDeposit = async (req, res) => {
  const { agencia, conta, deposit } = req.body;
  try {
    validateNumber(agencia, 'agencia');
    validateNumber(conta, 'conta');
    validateNumber(deposit, 'deposit');
    const account = await doDeposit(
      parseInt(agencia),
      parseInt(conta),
      parseInt(deposit)
    );
    res.status(200).send('Sucess! New balance is: ' + account.balance);
    logger.info(
      `PATCH /account/deposit - AG/ACC: ${agencia}/${conta} - balance: ${account.balance}`
    );
  } catch (error) {
    logger.info(
      `ERROR PATCH /account/deposit - AG/ACC: ${agencia}/${conta} - ${error.message}`
    );

    res.status(400).send(error.message);
  }
};

export const handlerWithdraw = async (req, res) => {
  const { agencia, conta, value } = req.body;
  try {
    validateNumber(agencia, 'agencia');
    validateNumber(conta, 'conta');
    validateNumber(value, 'value');
    const updatedAcc = await doWithdraw(
      parseInt(agencia),
      parseInt(conta),
      parseInt(value)
    );
    res.status(200).send('Sucess! New balance is: ' + updatedAcc.balance);
    logger.info(
      `PATCH /account/withdraw - AG/ACC: ${agencia}/${conta} - balance: ${updatedAcc.balance}`
    );
  } catch (error) {
    logger.info(
      `ERROR PATCH /account/withdraw - AG/ACC: ${agencia}/${conta} - ${error.message}`
    );
    res.status(400).send(error.message);
  }
};

export const handlerBalance = async (req, res) => {
  const { ag, cc } = req.query;
  try {
    validateNumber(ag, 'ag');
    validateNumber(cc, 'cc');
    const balance = await getBalance(parseInt(ag), parseInt(cc));

    res.status(200).send('Balance is: ' + balance);
    logger.info(
      `GET /account/balance - AG/ACC: ${ag}/${cc} - balance: ${balance}`
    );
  } catch (error) {
    logger.info(
      `ERROR GET /account/balance - AG/ACC: ${ag}/${cc} - ${error.message}`
    );
    res.status(400).send(error.message);
  }
};

export const handlerDelete = async (req, res) => {
  const { ag, cc } = req.query;
  try {
    validateNumber(ag, 'ag');
    validateNumber(cc, 'cc');
    const numberOfAccounts = await deleteAccount(parseInt(ag), parseInt(cc));
    res.status(200)
      .send(`Account deleted. \n There are ${numberOfAccounts} accounts for
     the #${ag} agency`);

    logger.info(`DELETE /account/delete - AG/ACC: ${ag}/${cc} - Deleted`);
  } catch (error) {
    logger.info(
      `ERROR DELETE /account/delete - AG/ACC: ${ag}/${cc} - ${error.message}`
    );
    res.status(400).send(error.message);
  }
};

export const handlerTransfer = async (req, res) => {
  const { origin, recipient, ammount } = req.body;

  try {
    validateNumber(origin, 'origin');
    validateNumber(recipient, 'recipient');
    validateNumber(ammount, 'ammount');
    const [originBalance, recipientBalance] = await doTransfer(
      parseInt(origin),
      parseInt(recipient),
      parseInt(ammount)
    );
    res
      .status(200)
      .send(
        `Origin account balance: ${originBalance} \n Recipient account balance: ${recipientBalance} `
      );
    logger.info(
      `PATCH /account/transfer - origin:${origin} recipient:${recipient} - Value: ${ammount} - Sucess `
    );
  } catch (error) {
    logger.info(
      `ERROR PATCH /account/transfer - origin:${origin} recipient:${recipient} - Value: ${ammount} - ${error.message} `
    );
    res.status(400).send(error.message);
  }
};

export const handlerAvgBalance = async (req, res) => {
  const { ag } = req.params;
  try {
    validateNumber(ag, 'agencia');
    const avgBalance = await getAvgBalance(parseInt(ag));
    res
      .status(200)
      .send(`The Average Balance for #${ag} agency is ${avgBalance}`);
    logger.info(`GET /avgBalance/:${ag} - AvgBalance: ${avgBalance}`);
  } catch (error) {
    logger.info(`ERROR GET /avgBalance/:${ag} - ${error.message}`);
    res.status(400).send(error.message);
  }
};

export const handlerLowest = async (req, res) => {
  const { limit } = req.query;
  try {
    validateNumber(limit, 'limit');
    const accounts = await getAccountsList(parseInt(limit), 1);
    res.status(200).send(accounts);
    logger.info(`GET /account/lowest - Limit: ${limit}`);
  } catch (error) {
    logger.info(
      `ERROR GET /account/lowest - Limit: ${limit} - ${error.message}`
    );
    res.status(400).send(error.message);
  }
};

export const handlerHighest = async (req, res) => {
  const { limit } = req.query;
  try {
    validateNumber(limit, 'limit');
    const accounts = await getAccountsList(parseInt(limit), -1);
    res.status(200).send(accounts);
    logger.info(`GET /account/highest - Limit: ${limit}`);
    // logger.info(
    //   `GET /account/highest - Limit: ${limit} - ${JSON.stringify(accounts)}`
    // );
  } catch (error) {
    logger.info(
      `ERROR GET /account/highest  - Limit: ${limit} - ${error.message}`
    );
    res.status(400).send(error.message);
  }
};

export const handlerTransferToPrivate = async (req, res) => {
  try {
    const [clientsOfPrivate, transferedClients] = await doTransferToPrivate();

    res.status(200).send(clientsOfPrivate);
    logger.info(
      `PATCH /account/transferToPrivate - Transfered: ${JSON.stringify(
        transferedClients
      )}`
    );
  } catch (error) {
    logger.info(`PATCH /account/transferToPrivate - ${error.message}`);
    res.status(400).send(error.message);
  }
};

export const handlerCreateAcc = async (req, res) => {
  const account = {};
  // console.log(req.path);
  Object.assign(account, req.body);

  try {
    validateNumber(account.agencia, 'agencia');
    validateNumber(account.conta, 'conta');
    validateNumber(account.balance, 'balance');
    validadeString(account.name, 'name');
    const newAcc = await createAcc(account);
    res.status(200).send(newAcc);
    logger.info(`POST ${req.path} - ${JSON.stringify(newAcc)}`);
  } catch (error) {
    res.status(400).send(error.message);
    logger.info(
      `ERROR: POST ${req.path} - ${JSON.stringify(account)} -  ${error.message}`
    );
  }
};

//Remove all accounts
// export const handlerExcludeAll = async (_, res) => {
//   try {
//     const accounts = await accountModel.deleteMany({});
//     res.status(200).send(accounts);
//     logger.info(accounts);
//   } catch (error) {
//     logger.info(error.message);
//     res.status(400).send(error.message);
//   }
// };
