import { ethers } from "hardhat";
import { expect } from "chai";
import { Contract } from "ethers"

describe("Flash Generate Test", function () {
    let token:Contract;
    let flash: Contract;
    let owner: any;
    let user: any;
    
    it("deployment", async function() { // beforeEach(async function() {
        // Get the first account as the owner
        [owner, user] = await ethers.getSigners();
        console.log("\tAccount address\t", await owner.address);

        // const Token = await ethers.getContractFactory("Token");
        // token = await Token.deploy();
        // console.log("\tToken address\t", await token.getAddress());

        // const Flash = await ethers.getContractFactory("Flash");
        // flash = await Flash.deploy(await token.getAddress());
        // console.log("\tFlash address\t", await flash.getAddress());

        // ################################################################# contract generate ########
        //import USDT from '../abi/USDT.json';

        // const usdtAddress = "0xaA8E23Fb1079EA71e0a56F48a2aA51851D8433D0";
        // const usdt = new ethers.Contract(usdtAddress, USDT, signer);

        // const flashAddress = '0x4e87bD6795f18fB288ED1717aCb7a995638b7AA3'; // sepolia
        // const flash = new ethers.Contract(flashAddress, Flash, signer);

        const tokenBalance = await token.balanceOf(owner);
        const tokenBalanceEth = ethers.formatUnits(tokenBalance.toString(), 'mwei');
        console.log("\towner token balance ", tokenBalanceEth);
    });

    it("should initialize flash generate ",async function() {

        // ######################## contract call - owner #############
        await token.approve(await flash.getAddress(), ethers.parseUnits("30000", 'mwei')); /// ------------------
        await flash.initialize();  // ______________------------------------------------------------------

        const tokenBalance = await token.balanceOf(owner);
        const tokenBalanceEth = ethers.formatUnits(tokenBalance.toString(), 'mwei');
        console.log("\towner token balance ", tokenBalanceEth);

        const tokenBalanceOfFlash = await token.balanceOf(await flash.getAddress());
        const tokenBalanceOfFlashEth = ethers.formatUnits(tokenBalanceOfFlash.toString(), 'mwei');
        console.log("\tflash contract token balance ", tokenBalanceOfFlashEth);
    });

    it("should initialize flash generate ",async function() {
        const storeDate = '30'; // 30 => 1000, 60 => 800, 90 => 600

        let countPerDay = 0;

        for (let i = 0 ; i < 5; i++) {
            await flash.generate(user, storeDate); // ##################--------------------------------------------- user generate
            countPerDay++;
        }

        const tokenBalanceOfFlash = await token.balanceOf(await flash.getAddress());
        const tokenBalanceOfFlashEth = ethers.formatUnits(tokenBalanceOfFlash.toString(), 'mwei');
        console.log("\tflash contract token balance ", tokenBalanceOfFlashEth);

        const tokenBalance = await token.balanceOf(user);
        const tokenBalanceEth = ethers.formatUnits(tokenBalance.toString(), 'mwei');
        console.log("\tuser token balance ", tokenBalanceEth);

        if (countPerDay >= 5) {
            console.log("Only call 5 times per day");
        } 
    });
});

/*
Flash.json

[
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "token",
          "type": "address"
        }
      ],
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "inputs": [
        {
          "internalType": "address",
          "name": "to",
          "type": "address"
        },
        {
          "internalType": "uint256",
          "name": "storeDate",
          "type": "uint256"
        }
      ],
      "name": "generate",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "name": "initialize",
      "outputs": [],
      "stateMutability": "nonpayable",
      "type": "function"
    }
  ]




  // USDT.json


  [{"inputs":[{"internalType":"string","name":"name","type":"string"},{"internalType":"string","name":"symbol","type":"string"},{"internalType":"uint8","name":"decimals","type":"uint8"},{"internalType":"address","name":"owner","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[],"name":"DOMAIN_SEPARATOR","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"EIP712_REVISION","outputs":[{"internalType":"bytes","name":"","type":"bytes"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"PERMIT_TYPEHASH","outputs":[{"internalType":"bytes32","name":"","type":"bytes32"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"mint","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"value","type":"uint256"}],"name":"mint","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"nonces","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"},{"internalType":"uint256","name":"deadline","type":"uint256"},{"internalType":"uint8","name":"v","type":"uint8"},{"internalType":"bytes32","name":"r","type":"bytes32"},{"internalType":"bytes32","name":"s","type":"bytes32"}],"name":"permit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"address","name":"recipient","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"}]

  */