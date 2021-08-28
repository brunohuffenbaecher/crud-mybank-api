// use my-bank-api-enhanced on insomnia to test endpoints

// import dotenv from 'dotenv';
import express from 'express';
import accountsRouter from './routes/accounts.js';
// import mongoose from 'mongoose';
import { db } from './models/db.js';
import cors from 'cors';

// dotenv.config();

const uri = db.url;

(async () => {
  try {
    console.log('Starting connection to MongoDB... ');
    await db.mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
    console.log('Connected to Database');
  } catch (error) {
    console.log('Error to connect: ' + error);
    process.exit(1);
  }
})();

const app = express();
app.use(express.json());
app.use(cors());
app.use('/', accountsRouter);

app.listen(process.env.PORT, () => {
  console.log('API Started');
});
