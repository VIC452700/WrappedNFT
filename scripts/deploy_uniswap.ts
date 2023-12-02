import { ethers } from "hardhat";

async function main() {
  const [owner] = await ethers.getSigners();
  console.log("account address is ", await owner.getAddress());

  // Set up the factory for the contract you want to  deploy ---------------------------------- sepolia
  const UniswapV2Factory = await ethers.getContractFactory("UniswapV2Factory");
  let feeToSetter = "0x0000000000000000000000000000000000000000";
  const factory = await UniswapV2Factory.connect(owner).deploy(feeToSetter);
  console.log('UniswapV2Factory address is ', await factory.getAddress());

  const UniswapV2Router02 = await ethers.getContractFactory("UniswapV2Router02");
  let wethAddress = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14";
  let factoryAddress = "0xB1908AF4FBa78DC13133c2280E32cAD7bB237083";
  const router = await UniswapV2Router02.connect(owner).deploy(factoryAddress, wethAddress);
  console.log('UniswapV2Router02 address is ', await router.getAddress());

  // Set up the factory for the contract you want to  deploy ----------------------------------- hardhat
  // const UniswapV2Factory = await ethers.getContractFactory("UniswapV2Factory");
  // let feeToSetter = "0x67CF3bF40b2b3b3D68F6c361AEf81F8AEb2dB637";
  // // Deploy the contract with the desired constructor parameters
  // const factory = await UniswapV2Factory.connect(owner).deploy(feeToSetter);
  // await factory.deployed();
  // console.log('UniswapV2Factory address is ', factory.address);

  // const UniswapV2Router02 = await ethers.getContractFactory("UniswapV2Router02");
  // let weth = "0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14";
  // // Deploy the contract with the desired constructor parameters
  // const router = await UniswapV2Router02.connect(owner).deploy(factory.address, weth);
  // await router.deployed();
  // console.log('UniswapV2Router02 address is ', router.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});