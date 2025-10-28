require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

const accounts = process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : {
  mnemonic: "test test test test test test test test test test test junk",
  path: "m/44'/60'/0'/0",
  initialIndex: 0,
  count: 20,
  passphrase: "",
};

module.exports = {
  solidity: "0.8.24",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts,
    },
  },
};
