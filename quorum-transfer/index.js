const Web3 = require('web3');
let HDWalletProvider = require("truffle-hdwallet-provider");

let MNEMONIC = 'game chef atom text edge anchor west park rabbit rack casino donate';
let ETHERUEM_URL_RPC = {
  ROPSTEN: 'https://ropsten.infura.io/5NO5M7LL2FEmketTWblZ',
  QUORUM: 'http://10.50.0.2:22000'
}
const TO_ADDRESS = '0x1398f371170139894f53cf3b5e266a675d7c657b';
const AMOUNT = 100;

let urlRpc = ETHERUEM_URL_RPC[process.env.ENV] ? ETHERUEM_URL_RPC[process.env.ENV] : ETHERUEM_URL_RPC.QUORUM;

let web3;
let defaultAccount;

let init = async () => {
  return new Promise((resolve, reject) => {
    let provider = new HDWalletProvider(MNEMONIC, urlRpc);
    web3 = new Web3(provider.engine);

    web3.eth.getAccounts((error, accounts) => {
      if (error) {
        console.log(`Error initialising web3:\n${error.message}`)
        return reject(true);
      }
      defaultAccount = accounts[0];
      web3.eth.defaultAccount = defaultAccount;
      console.log(`Web3 intialized with default account: ${accounts[0]}`);
      return resolve(true);
    });
  })
}

let getBalance =  async (account) => {
  return new Promise((resolve, reject) => {
    web3.eth.getBalance(account, (err, balance) => {
      if(err) {
        console.log(`Error getting balance:\n${err.message}`);
        return reject(true);
      }
      resolve(balance.toNumber());
    })
  })
}

let transfer = () => {
  return new Promise((resolve, reject) => {
    web3.eth.sendTransaction(
      Object.assign(
        { to: TO_ADDRESS, value: AMOUNT },
        // add 0 gasPrice only if quorum 
        (urlRpc === ETHERUEM_URL_RPC.QUORUM) && {gasPrice: 0}
      ), function (err, txHash) {
      if (err) {
        console.log(`Error transferring ethers: ${err.message}`);
        return reject(true);
      } else {
        console.log(`Please consult tx: ${txHash}`);
        return resolve(true);
      }
    })
  })
}

(async () => {
  await init();
  let availableBalance = await getBalance(defaultAccount);
  console.log(`Available balance: ${availableBalance}`)
  console.log(`Using RPC Url: ${urlRpc}`);
  console.log(`Transaction 1: Transfering ${AMOUNT} wei to ${TO_ADDRESS}`)
  await transfer();
  console.log(`Transaction 2: Transfering ${AMOUNT} wei to ${TO_ADDRESS}`)
  await transfer();
  return;
})()