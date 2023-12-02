import { ethers } from "hardhat";

async function main() {
  const [owner] = await ethers.getSigners();
  console.log(await owner.getAddress());

  const TetherToken = await ethers.getContractFactory("TetherToken");
  const tether = await TetherToken.connect(owner).deploy(1000000, "Tether USD", "USDT", 18);
  console.log('Tether Token Contract deployed at:', await tether.getAddress());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});