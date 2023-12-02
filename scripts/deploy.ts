import { ethers } from "hardhat";

async function main() {
  const [owner] = await ethers.getSigners();
  console.log("wallet address:", await owner.getAddress());

  // ------------------------------- Ethereum --------------------------------------------
  // Set up the factory for the contract you want to deploy
  // const TokenVault = await ethers.getContractFactory("TokenVault");
  // const asset_ = '0xe2B0E50603Cd62569A94125628D796ad21339299'
  // const tokenVault = await TokenVault.deploy(asset_, "vaultSPC-WETH", "vSPC-WETH");
  // console.log("Vault deployed to ", await tokenVault.getAddress());

  // ------------------------------ BSC --------------------------------------------------
  // Set up the factory for the contract you want to deploy
  // const BSCVault = await ethers.getContractFactory("BSCVault");
  // const asset_ = '0xe7C7a7abC1D3DbFfE5614B5b2538da3b3e3186c1'
  // const bscVault = await BSCVault.deploy(asset_, "vaultBIC-WBNB", "vBIC-WBNB");
  // console.log("Vault deployed to ", await bscVault.getAddress());

  // ------------------------------ Polygon --------------------------------------------------
  // Set up the factory for the contract you want to deploy
  const PolygonVault = await ethers.getContractFactory("PolygonVault");
  const asset_ = '0xa9886211C31dc81FB1AD11Ee1CA8ad96F0Da0D8f'
  const polygonVault = await PolygonVault.deploy(asset_, "vaultPGT-WMATIC", "vPGT-WMATIC");
  console.log("Vault deployed to ", await polygonVault.getAddress());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});