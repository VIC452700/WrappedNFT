import { ethers } from "hardhat";

async function main() {
  const [owner] = await ethers.getSigners();
  console.log("wallet address:", await owner.getAddress());

  // ------------------------------- Ethereum Sepolia --------------------------------------------
  // Set up the factory for the contract you want to deploy
  const AaveVault = await ethers.getContractFactory("AaveVault");
  
  const _asset = '0x94a9D9AC8a22534E3FaCa9F4e7F2E2cf85d5E4C8'; // usdc 
  const _name = 'xfiUSDC';
  const _symbol = 'xUSDC';
  const _treasury = '0x9Bc62869Ad9E43d03e97b033D4991ab6f1a9B784';
  const _usdt = '0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0';
  const _xxx = '0xc15f38c66CD145ed3F2c6D54b7840c5b10B3164c'; // xxx
  const _aaveAToken = '0x16dA4541aD1807f4443d92D26044C1147406EB80' // Aave aUSDC address
  const _aavePool = '0x6Ae43d3271ff6888e7Fc43Fd7321a503ff738951'; // aave v3 pool
  const _aaveRewards = '0x4DA5c4da71C5a167171cC839487536d86e083483' // Aave RewardsController address
  const _routerAddress = '0x86dcd3293C53Cf8EFd7303B57beb2a3F671dDE98' // Uniswap V2 router address
  const _factoryAddress = '0xc9f18c25Cfca2975d6eD18Fc63962EBd1083e978' // Uniswap V2 factory address
  
  const aaveVault = await AaveVault.deploy(_asset, _name, _symbol, _treasury, _usdt, _xxx, _aaveAToken, _aavePool, _aaveRewards, _routerAddress, _factoryAddress);
  
  console.log("Vault deployed to ", await aaveVault.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});