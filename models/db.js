import mongoose from 'mongoose';
import { accountModel } from './accountModel.js';
// import dotenv from 'dotenv';
// dotenv.config();

const db = {};
db.url = process.env.MONGO_CONNECTION;
db.model = accountModel;
db.mongoose = mongoose;
db.collections = ['accounts', 'logs_accounts'];

export { db };
