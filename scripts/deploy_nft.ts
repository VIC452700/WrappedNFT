import { ethers } from "hardhat";

async function main() {
  const [owner] = await ethers.getSigners();
  console.log(await owner.getAddress());

  // ---------- Ethereum Token SPC -----------------------------------------
  const WrappedCollectionNFT = await ethers.getContractFactory("WrappedCollectionNFT");
  const collection = await WrappedCollectionNFT.deploy();
  console.log('WrappedCollectionNFT Contract deployed at:', await collection.getAddress());

  const nftAddress = await collection.getAddress();
  // const nftAddress = '0x3F7a7E075b6ffA94DD31e8Ef3534118B13ad41D7';
  const WrappedCollectionNFTProxy = await ethers.getContractFactory("WrappedCollectionNFTProxy");
  const tok = await WrappedCollectionNFTProxy.deploy(nftAddress);
  
  console.log(await tok.getAddress(), "createNewCollection contract address");
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});