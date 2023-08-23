require("@nomiclabs/hardhat-waffle")
require("hardhat-gas-reporter")
require("@nomiclabs/hardhat-etherscan")
require("dotenv").config()
require("solidity-coverage")
require("hardhat-deploy")
//require("@nomicfoundation/hardhat-toolbox")
/** @type import('hardhat/config').HardhatUserConfig */

const ALCHEMY_API_KEY=process.env.ALCHEMY_API_KEY
const SEPOLIA_PRIVATE_KEY=process.env.SEPOLIA_PRIVATE_KEY
const COINMARKET_API_KEY=process.env.COINMARKET_API_KEY
const ETHERSCAN_API_KEY=process.env.ETHERSCAN_API_KEY
task("accounts", "Prints the list of accounts", async () => {
  const accounts = await ethers.getSigners()

  for (const account of accounts) {
    console.log(account.address);
  }
});


module.exports = {
  solidity: {
    compilers: [{ version: "0.8.18"}, { version: "0.6.6"}],
  
  },
 namedAccounts: {
   deployer: {
       default: 0, // here this will by default take the first account as deployer
   },
},
  defaultNetwork: "hardhat",
  networks: {
     sepolia: {
      url:`https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY],
      chainId: 11155111,
      blockConfirmations: 6,
     },
  
   /*  localhost: {
      urk: "http://127.0.0.1:8545/",
      chainId: 31337,
  //  }, */
    },
    etherscan: {
      apiKey: {
        sepolia:`${ETHERSCAN_API_KEY}`
      },
    },
    gasReporter: {
      enabled: true,
      outputFile: "gas-report.txt",
      noColors: true,
      currency: "USD",
      coinmarketcap: COINMARKET_API_KEY,
      token: "ETH"
    },
};
