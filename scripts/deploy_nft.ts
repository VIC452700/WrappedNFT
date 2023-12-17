import { ethers } from "hardhat";

async function main() {
  const [owner] = await ethers.getSigners();
  console.log(await owner.getAddress());

  // ---------------------------- mumbai -------------------------------------
  // const WrappedCollectionNFT = await ethers.getContractFactory("WrappedCollectionNFT");
  // const collection = await WrappedCollectionNFT.deploy();
  // console.log('WrappedCollectionNFT Contract deployed at:', await collection.getAddress());

  // const nftAddress = await collection.getAddress();
  // // const nftAddress = '0x9dEb94F880293F565AA4d70a80c6D02AAdf77867';
  // const wrapAddress = '0xE85c3A4C40eb47C973f3eddC18AeB97eE47d8006';
  // const WrappedCollectionNFTProxy = await ethers.getContractFactory("WrappedCollectionNFTProxy");
  // const tok = await WrappedCollectionNFTProxy.deploy(nftAddress, wrapAddress);
  
  // console.log('WrappedCollectionNFTProxy Contract deployed at:', await tok.getAddress());

  // // ------------------------- sepolia ---------------------------------
  
  // const WrappedCollectionNFT = await ethers.getContractFactory("WrappedCollectionNFT");
  // const collection = await WrappedCollectionNFT.deploy();
  // console.log('WrappedCollectionNFT Contract deployed at:', await collection.getAddress());

  // const nftAddress = await collection.getAddress();
  // // const nftAddress = '0x9dEb94F880293F565AA4d70a80c6D02AAdf77867';
  // const wrapAddress = '0xa0F9d6bDf6103619360Bb3411954B638678e6309';
  // const WrappedCollectionNFTProxy = await ethers.getContractFactory("WrappedCollectionNFTProxy");
  // const tok = await WrappedCollectionNFTProxy.deploy(nftAddress, wrapAddress);
  
  // console.log('WrappedCollectionNFTProxy Contract deployed at:', await tok.getAddress());

  // // ------------------------- sepolia infra ---------------------------------
  
  // const WrappedCollectionNFT = await ethers.getContractFactory("WrappedCollectionNFT");
  // const collection = await WrappedCollectionNFT.deploy();
  // console.log('WrappedCollectionNFT Contract deployed at:', await collection.getAddress());

  // const nftAddress = await collection.getAddress();
  // // const nftAddress = '0x9dEb94F880293F565AA4d70a80c6D02AAdf77867';
  // const wrapAddress = '0xf287A7EC6cc6bcB8262bd310e21818d4166378D2';
  // const WrappedCollectionNFTProxy = await ethers.getContractFactory("WrappedCollectionNFTProxy");
  // const tok = await WrappedCollectionNFTProxy.deploy(nftAddress, wrapAddress);
  
  // console.log('WrappedCollectionNFTProxy Contract deployed at:', await tok.getAddress());

   // ------------------------- BSC testnet infra ---------------------------------
  
   const WrappedCollectionNFT = await ethers.getContractFactory("WrappedCollectionNFT");
   const collection = await WrappedCollectionNFT.deploy();
   console.log('WrappedCollectionNFT Contract deployed at:', await collection.getAddress());
 
   const nftAddress = await collection.getAddress();
   // const nftAddress = '0x9dEb94F880293F565AA4d70a80c6D02AAdf77867';
   const wrapAddress = '0xE484ae97aD9dE818d10D67B9C30c07F48EeA25B0';
   const WrappedCollectionNFTProxy = await ethers.getContractFactory("WrappedCollectionNFTProxy");
   const tok = await WrappedCollectionNFTProxy.deploy(nftAddress, wrapAddress);
   
   console.log('WrappedCollectionNFTProxy Contract deployed at:', await tok.getAddress());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});