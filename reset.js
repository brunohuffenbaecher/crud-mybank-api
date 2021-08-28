import { db } from './models/db.js';
import dotenv from 'dotenv';
import { promises as fs } from 'fs';

dotenv.config();

const url = process.env.MONGO_CONNECTION;

const [ACCOUNTS_COLLECTION, LOGS_COLLECTION] = db.collections;

(async () => {
  try {
    console.log('Starting connection to MongoDB... ');
    await db.mongoose.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
    });
  } catch (error) {
    console.log('Error to connect: ' + error);
    process.exit(1);
  }
})();

const { connection } = db.mongoose;

connection.once('open', () => {
  console.log('Connected to Database');
  recreateCollections();
});

async function recreateCollections() {
  console.log('Deleting collections...');
  await dropCollections();

  console.log('Creating collections...');
  await createCollections();

  console.log('Inserting data in collections...');
  await populateCollections();

  connection.close();
  console.log('Process is done!');
}

async function dropCollections() {
  try {
    let dropped = await connection.db.dropCollection(ACCOUNTS_COLLECTION);
    dropped = await connection.db.dropCollection(LOGS_COLLECTION);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

async function createCollections() {
  try {
    const created = await connection.db.createCollection(ACCOUNTS_COLLECTION);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}

async function populateCollections() {
  try {
    const stringArrayTransactions = await fs.readFile(
      './data/accounts.json',
      'utf-8'
    );

    const accounts = JSON.parse(stringArrayTransactions);

    const insert = await connection.db
      .collection(ACCOUNTS_COLLECTION)
      .insertMany(accounts);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
}
