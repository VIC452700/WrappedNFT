import { ethers } from "hardhat";

async function main() {
  const [owner] = await ethers.getSigners();
  console.log(await owner.getAddress());

  const WRAP = await ethers.getContractFactory("WRAP");
  const wrap = await WRAP.deploy();
  console.log('\tWRAP Contract deployed at:', await wrap.getAddress());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});