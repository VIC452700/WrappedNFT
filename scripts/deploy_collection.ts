import { ethers } from "hardhat";

async function main() {
  const [owner] = await ethers.getSigners();
  console.log(await owner.getAddress());

  const WrappedCollectionNFT = await ethers.getContractFactory("WrappedCollectionNFT");
  const collection = await WrappedCollectionNFT.deploy("WrappedNFT", "WRAPNFT");
  console.log('WrappedCollectionNFT Contract deployed at:', await collection.getAddress());

  // ---------- BSC Token BIC -----------------------------------------
  // const BinanceToken = await ethers.getContractFactory("BinanceToken");
  // const bic = await BinanceToken.connect(owner).deploy();
  // console.log('BinanceToken Contract deployed at:', await bic.getAddress());

  // ---------- Polygon Token PGT -----------------------------------------
  // const PolygonToken = await ethers.getContractFactory("PolygonToken");
  // const pgt = await PolygonToken.connect(owner).deploy();
  // console.log('PolygonToken Contract deployed at:', await pgt.getAddress());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});