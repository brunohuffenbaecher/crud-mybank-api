import express from 'express';
import {
  handlerAvgBalance,
  handlerBalance,
  handlerCreateAcc,
  handlerDelete,
  handlerDeposit,
  handlerHighest,
  handlerList,
  handlerLowest,
  handlerRoot,
  handlerTransfer,
  handlerTransferToPrivate,
  handlerWithdraw,
} from '../handler/accountHandler.js';

const router = express.Router();

router.all('/', handlerRoot);
router.get('/account/list', handlerList);
router.patch('/account/deposit', handlerDeposit);
router.patch('/account/withdraw', handlerWithdraw);
router.get('/account/balance', handlerBalance);
router.delete('/account/delete', handlerDelete);
router.patch('/account/transfer', handlerTransfer);
router.get('/account/avgBalance/:ag', handlerAvgBalance);
router.get('/account/lowest', handlerLowest);
router.get('/account/highest', handlerHighest);
router.patch('/account/transferToPrivate', handlerTransferToPrivate);
router.post('/account/new', handlerCreateAcc);
//router.delete('/account/excludeAll', handlerExcludeAll);

export default router;
