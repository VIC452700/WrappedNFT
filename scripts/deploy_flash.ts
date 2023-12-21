import { ethers } from "hardhat";

async function main() {
  const [owner] = await ethers.getSigners();
  console.log(await owner.getAddress());

  const usdtAddress = '0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0'; // sepolia
  const Flash = await ethers.getContractFactory("Flash");
  const flash = await Flash.deploy(usdtAddress);
  console.log('Flash Contract deployed at:', await flash.getAddress());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});