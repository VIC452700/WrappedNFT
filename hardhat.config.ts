import '@openzeppelin/hardhat-upgrades';
import '@nomiclabs/hardhat-etherscan';
import "dotenv/config";

module.exports = {
  defaultNetwork: "hardhat",
  networks: {
  	localhost: {
      url: "http://127.0.0.1:8545"
    },
    hardhat: {
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_INFRA,
      chainId: 11155111,
      accounts: [process.env.PRIVATE_KEY!]
    },
    goerli: {
      url: process.env.GOERLI_RPC,
      chainId: 5,
      accounts: [process.env.PRIVATE_KEY!]
    },
    eth_mainnet: {
      url: process.env.ETH_MAINNET_RPC,
      chainId: 1,
      accounts: [process.env.PRIVATE_KEY!]
    },
    bsc_testnet: {
      url: process.env.BSC_RPC,
      chainId: 97,
      accounts: [process.env.PRIVATE_KEY!]
    },
    bsc_mainnet: {
      url: process.env.BSC_MAINNET_RPC,
      chainId: 56,
      accounts: [process.env.PRIVATE_KEY!]
    },
    testnet: {
      url: process.env.MUMBAI_RPC,
      chainId: 80001,
      accounts: [process.env.PRIVATE_KEY!]
    },
    mainnet: {
      url: process.env.POLYGON_MAINNET_RPC,
      chainId: 137,
      accounts: [process.env.PRIVATE_KEY!]
    },
    bitrock_mainnet: {
      url: process.env.POLYGON_MAINNET_RPC,
      chainId: 137,
      accounts: [process.env.PRIVATE_KEY!]
    },
    bitrock_testnet: {
      url: process.env.BITROCK_TESTNET,
      chainId: 7771,
      accounts: [process.env.PRIVATE_KEY!]
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
    // apiKey: process.env.BSCSCAN_API_KEY,
    // apiKey: process.env.POLYGON_API_KEY,
  },
  solidity: {
    compilers: [
      {
        version: "0.4.17",
        settings: {
          optimizer: {
            enabled: true
          }
        },
      },
      {
        version: "0.4.24",
        settings: {
          optimizer: {
            enabled: true
          }
        },
      },
      {
        version: "0.5.16",
        settings: {
          optimizer: {
            enabled: true
          }
        },
      },
      {
        version: "0.6.6",
        settings: {
          optimizer: {
            enabled: true
          }
        },
      },
      {
        version: "0.8.10",
        settings: {
          optimizer: {
            enabled: true
          }
        },
      },
      {
        version: "0.8.19",
        settings: {
          optimizer: {
            enabled: true
          }
        },
      },
      {
        version: "0.8.23",
        settings: {
          optimizer: {
            enabled: true
          }
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  mocha: {
    timeout: 20000
  }
};
