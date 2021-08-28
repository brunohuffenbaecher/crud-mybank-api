import mongoose from 'mongoose';

const accountSchema = mongoose.Schema(
  {
    agencia: {
      type: Number,
      require: true,
    },
    conta: {
      type: Number,
      require: true,
    },
    name: {
      type: String,
      require: true,
    },
    balance: {
      type: Number,
      require: true,
      min: [0, `Balance can't be negative`],
    },
  },
  { versionKey: false }
);

const accountModel = mongoose.model('account', accountSchema); //The first argument is the singular name of the collection your model is for. Mongoose automatically looks for the plural, lowercased version of your model name.

export { accountModel };
