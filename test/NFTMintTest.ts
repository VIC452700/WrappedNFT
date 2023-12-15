import { ethers } from "hardhat";
import { expect } from "chai";
import { Contract } from "ethers"

describe("NFT Mint Test", function () {
    let wrappedNFT:Contract;
    let wrappedNFTProxy: Contract;
    let wrap: Contract;
    let owner: any;
    let user: any;
    let user1: any;
    
    it("should deploy wrappedNFT and proxy contract", async function() { // beforeEach(async function() {
        // Get the first account as the owner
        [owner, user, user1] = await ethers.getSigners();
        console.log("\tAccount address\t", await owner.getAddress());

        const WRAP = await ethers.getContractFactory("WRAP");
        wrap = await WRAP.deploy();
        console.log('\tWRAP Contract deployed at:', await wrap.getAddress());
        
        const WrappedCollectionNFT = await ethers.getContractFactory("WrappedCollectionNFT");
        wrappedNFT = await WrappedCollectionNFT.deploy();
        console.log('\tWrappedCollectionNFT Contract deployed at:', await wrappedNFT.getAddress());    

        const WrappedCollectionNFTProxy = await ethers.getContractFactory("WrappedCollectionNFTProxy");
        wrappedNFTProxy = await WrappedCollectionNFTProxy.deploy(await wrappedNFT.getAddress());
        console.log('\tWrappedCollectionNFTProxy Contract deployed at:', await wrappedNFTProxy.getAddress());    

    });

    it("should create new collection with token name and symbol every time (proxy contract)", async function() {

        const tokenName = 'Airplane NFT';
        const tokenSymbol = 'AIRNFT';
        const description = 'This is Airplane NFT';
        const tokenInfo: string[] = [tokenName, tokenSymbol, description];
        
        const collectionPrice = '100000';
        const mintPrice = '200000';
        const nftPrice: string[] = [collectionPrice, mintPrice];

        const totalSupply = 10;
        const baseURICIDHash = 'QmWV24rL61SVoTxtxiJhHcy29T7TCaF61kNCf8FgsF8Cgi';
        const placeholderImageCIDHash = '';
        
        const revenueAddresses = [
            { to: '0xA9aE05943539DCb601d343aF9193Df17be0348E3', percentage: 50 },
            { to: '0xb2530c5d8496677353166cb4E705093bD800251D', percentage: 30 },
            { to: '0x9Bc62869Ad9E43d03e97b033D4991ab6f1a9B784', percentage: 15 }
        ];

        const royaltyFee = 700; // less than 1000
        const soulboundCollection = false; // default - transferable disable 

        await wrappedNFTProxy.createNewCollection();

        
        const collectionAddress = await wrappedNFTProxy.getCollectionAddress();
        console.log("\tpanda collection nft created at ", await wrappedNFTProxy.getCollectionAddress());

        // const revenueInfo = await wrappedNFTProxy.getRevenueAddressArray();
        // for (let i =0 ; i< revenueInfo.length; i++) {
        //     console.log("revenue ", i, ": address ", revenueInfo[i].to, "\t percent ", revenueInfo[i].percentage);
        // }

        // console.log("------------------test ----------------", await wrappedNFTProxy.getTestNumber());

        // console.log("\tcollection token name ", await wrappedNFTProxy.getTokenName(collectionAddress));
        // console.log("\tcollection token symbol ", await wrappedNFTProxy.getTokenSymbol(collectionAddress));
        // console.log("\tcollection token description ", await wrappedNFTProxy.getDescription(collectionAddress));
        
        // console.log("\tcollection collection price ", await wrappedNFTProxy.getCollectionPrice(collectionAddress));
        // console.log("\tcollection mint price ", await wrappedNFTProxy.getMintPrice(collectionAddress));
        // console.log("\tcollection collection size ", await wrappedNFTProxy.getCollectionSize(collectionAddress));

        // await wrappedNFTProxy.createNewCollection("Rabbit NFT", "RNFT", "This is Rabbit NFT", 20000, 20000, 3);

        // const collectionList = await wrappedNFTProxy.getCollectionList();
        // for (let i=0; i<collectionList.length; i++) {
        //     console.log("\tcollection ", i, " address :\t", collectionList[i]);
        // }

        // await wrappedNFTProxy.setCollection('0xCafac3dD18aC6c6e92c921884f9E4176737C052c');
        // console.log("\tnew collection address \t", await wrappedNFTProxy.getCurrentCollection());
    });

    // it("should mint and burn new NFT with collection id", async function () {
    //     const collectionAddress = await wrappedNFTProxy.getCurrentCollection();

    //     await wrappedNFTProxy.mintNFTWithCollection(owner, collectionAddress, 0);
    //     await wrappedNFTProxy.mintNFTWithCollection(user, collectionAddress, 1);
    //     await wrappedNFTProxy.mintNFTWithCollection(user1, collectionAddress, 2);

    //     await wrappedNFTProxy.burnNFTWithCollection(collectionAddress, 2);
    //     console.log("\tSuccess mint 3 NFT and burn NFT tokenID 2");
    // });
    
    // it("should sequential mint with mint number", async function () {
    //     const collectionAddress = await wrappedNFTProxy.getCurrentCollection();
    //     await wrappedNFTProxy.mintNFTForSequential(owner, collectionAddress, 5)
        
    //     console.log("\tminted token number \t", await wrappedNFTProxy.getBalanceOf(collectionAddress, owner));

    //     for (let i =0; i<10; i++) {
    //         console.log("\ttoken", i, "\t", await wrappedNFTProxy.exists(collectionAddress, i));
    //     }
    // });

    // it("should create collection and mint NFT ", async function () {
    //     await wrappedNFTProxy.createCollectionNFT("Pet NFT", "PNFT", "This is Pet NFT", 30000, 15000, 10, user1);
        
    //     const collectionAddress = await wrappedNFTProxy.getCurrentCollection();
        
    //     console.log("\tminted token number \t", await wrappedNFTProxy.getBalanceOf(collectionAddress, user1));

    //     for (let i =0; i<10; i++) {
    //         console.log("\ttoken", i, "\t", await wrappedNFTProxy.exists(collectionAddress, i));
    //     }
    // });

    // it("should withdraw wrappedNFTs and update the shareHolder", async function () {
    //     const shareToWithdraw = ethers.parseEther("50");
    //     await tokenVault._withdraw(shareToWithdraw, user.address);
    //     console.log("\tSuccess send 50 vSPC to vault");
        
    //     // Check that shareHolder mapping was updated correctly
    //     expect(await tokenVault.shareHolder(owner.address)).to.equal(ethers.parseEther("50"));
    //     // Check that the user received the contract amount of wrappedNFTs
    //     expect(await wrappedNFT.balanceOf(user.address)).to.equal(ethers.parseEther("55"));
    //     console.log("\tSuccess withdraw 55 SPC from vault (Test APY: 10%)");
    // });

    // it("should set uniswap v2 factory", async function() {
    //     let factory = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9';
    //     await tokenVault.setUniswapFactoryAddress(factory);
    //     console.log("\tuniswap v2 factory address is ", await tokenVault.getUniswapFactoryAddress());
    // });

    // it("should set uniswap v2 router", async function() {
    //     let router = '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9';
    //     await tokenVault.setUniswapRouterAddress(router);
    //     console.log("\tuniswap v2 router address is ", await tokenVault.getUniswapRouterAddress());
    // });

    // it("should set vault name and symbol", async function() {
    //     await tokenVault.setVaultName("Vault Token Name");
    //     console.log("\tvault name is ", await tokenVault.getVaultName());

    //     await tokenVault.setVaultSymbol("VTC");
    //     console.log("\tvault symbol is ", await tokenVault.getVaultSymbol());
    // });

    // it("should set several fees like PF, CR, PR", async function () {
    //     await tokenVault.setPerformanceFee(20);
    //     console.log("\tPF is ", await tokenVault.getPerformanceFee());

    //     await tokenVault.setConversionRate(50);
    //     console.log("\tCR is ", await tokenVault.getConversionRate());

    //     await tokenVault.setPercentRate(25);
    //     console.log("\tPR is ", await tokenVault.getPercentRate());
    // });

    // it("should set token0, token1, wrappedNFTProxy, treasury address", async function() {
    //     await tokenVault.setToken0Address(await wrappedNFT.getAddress());
    //     console.log("\ttoken0  address is ", await tokenVault.getToken0Address());

    //     await tokenVault.setToken1Address(await wrappedNFTProxy.getAddress());
    //     console.log("\ttoken1  address is ", await tokenVault.getToken1Address());

    //     await tokenVault.setwrappedNFTProxyAddress(await wrappedNFTProxy.getAddress());
    //     console.log("\twrappedNFTProxy address is ", await tokenVault.getwrappedNFTProxyAddress());

    //     await tokenVault.setTreasuryAddress(await wrappedNFT.getAddress());
    //     console.log("\ttreasury  address is ", await tokenVault.getTreasuryAddress());
    // });

    // it("should add liquidity on uniswapV2 pool", async function () {
    //     // User -> Vault (tokenA, tokenB), Approve(Vault Address) -> Transfer
    //     const vaultAddress = await tokenVault.getAddress();
    //     wrappedNFT.approve(vaultAddress, 1000000);
    //     wrappedNFTProxy.approve(vaultAddress, 1000000);

    //     wrappedNFT.transfer(vaultAddress, 1000000);
    //     wrappedNFTProxy.transfer(vaultAddress, 1000000);

    //     let a = await wrappedNFT.balanceOf(vaultAddress);
    //     let b = await wrappedNFTProxy.balanceOf(vaultAddress);

    //     console.log("\twrappedNFT ", a);
    //     console.log("\twrappedNFTProxy ", b);

    //     // Add liquidity to the pool
    //     let liquidity = await tokenVault.addLiquidityWithERC20(
    //         await wrappedNFT.getAddress(),
    //         await wrappedNFTProxy.getAddress(),
    //         1000000,
    //         1000000,
    //     );

    //     console.log("\tadd liquidity SPC-wrappedNFTProxy - ", typeof(liquidity));
    // });

    // it("should remove liquidity on uniswap v2 ", async function () {
    //     let {token0, token1} = await tokenVault.removeLiquidityWithERC20(await wrappedNFT.getAddress(), await wrappedNFTProxy.getAddress(), 1500);
    //     console.log("\tsuccess remove liquidity", token0, token1);
        
    //     let a = await wrappedNFT.balanceOf(await tokenVault.getAddress());
    //     let b = await wrappedNFTProxy.balanceOf(await tokenVault.getAddress());

    //     console.log("\twrappedNFT ", a);
    //     console.log("\twrappedNFTProxy ", b);
    // });

    // it("should exist pair address for spc and wrappedNFTProxy", async function () {
    //     let pairAddress = await tokenVault.getPairAddress(await wrappedNFT.getAddress(), await wrappedNFTProxy.getAddress());
    //     console.log("\tSPC-wrappedNFTProxy pair address ", pairAddress);
    // })

    // it("should get reserve amounts for spc and wrappedNFTProxy", async function () {
    //     let {spcAmount, wrappedNFTProxyAmount} = await tokenVault.getReserveAmounts(await wrappedNFT.getAddress(), await wrappedNFTProxy.getAddress());
    //     console.log("\tSPC reserve amount ", spcAmount);
    //     console.log("\twrappedNFTProxy reserve amount ", wrappedNFTProxyAmount);
    // });

    // it("should deposit wrappedNFT pair to vault", async function () {
    //     let vaultLP = await tokenVault.balanceOf(owner.address);
    //     let uniLP = await tokenVault.getTVL();

    //     console.log("\tUser original vSPC-WETH amount ", vaultLP);
    //     console.log("\tVault original Uni LP TVL amount ", uniLP);

    //     // Approve the tokens for transfer
    //     const vaultAddress = await tokenVault.getAddress();
        
    //     await wrappedNFT.approve(vaultAddress, 100000);
    //     await wrappedNFTProxy.approve(vaultAddress, 100000);

    //     await tokenVault.depositwrappedNFTPair(100000, 100000); 

    //     let userInfo = await tokenVault.getUserInfo(owner);
    //     console.log("\tuser address ", userInfo._address);
    //     console.log("\tuser _depositAmountOfToken0 ", userInfo._depositAmountOfToken0);
    //     console.log("\tuser _depositAmountOfToken1 ", userInfo._depositAmountOfToken1);
    //     console.log("\tuser _lastDepositedTime ", userInfo._lastDepositedTime);
    //     console.log("\tuser _lastClaimedTime ", userInfo._lastClaimedTime);
    // });

    // it("should preview swap output amount without doing swap ", async function () {
    //     let output = await tokenVault.previewSwapAmountOut(wrappedNFTProxy, SPC, 10000);
    //     console.log("\tpreview swap input amount 10000");
    //     console.log("\tpreview swap output amount ", output);
    // });

    // it("should swap exact token0 for token1 (wrappedNFTProxy-SPC) on uniswapV2", async function () {
    //     // User current status
    //     let c = await wrappedNFT.balanceOf(owner.address);
    //     let d = await wrappedNFTProxy.balanceOf(owner.address);

    //     console.log("\tuser wrappedNFTProxy ", d);
    //     console.log("\tuser wrappedNFT ", c);
    
    //     // User -> Vault (wrappedNFTProxy -> SPC)
    //     await wrappedNFTProxy.approve(await tokenVault.getAddress(), 10000);
    //     await wrappedNFTProxy.transfer(await tokenVault.getAddress(), 10000);

    //     // Uniswap -> Vault -> User (wrappedNFT amountOut)
    //     let amountOut = await tokenVault.swapExactToken0ForToken1(await wrappedNFTProxy.getAddress(), await wrappedNFT.getAddress(), 10000, 1, owner.address);
        
    //     // user after status 
    //     let cc = await wrappedNFT.balanceOf(owner.address);
    //     let dd = await wrappedNFTProxy.balanceOf(owner.address);

    //     console.log("\n\tafter user wrappedNFTProxy --- ", dd);
    //     console.log("\tafter user wrappedNFT +++ ", cc);
    // });

    // it("should swap token0 for exact token1 (wrappedNFTProxy-SPC) on uniswapV2", async function() {
    //     // User current status
    //     let c = await wrappedNFT.balanceOf(owner.address);
    //     let d = await wrappedNFTProxy.balanceOf(owner.address);

    //     console.log("\tuser wrappedNFTProxy ", d);
    //     console.log("\tuser wrappedNFT ", c);
    
    //     // User -> Vault (wrappedNFTProxy -> SPC)
    //     await wrappedNFTProxy.approve(await tokenVault.getAddress(), 10000);
    //     await wrappedNFTProxy.transfer(await tokenVault.getAddress(), 10000);

    //     // User -> Uniswap : wrappedNFTProxy 5000  
    //     // Uniswap -> User : wrappedNFT 3000 (refund left wrappedNFTProxy)
    //     let amountOut = await tokenVault.swapToken0ForExactToken1(await wrappedNFTProxy.getAddress(), await wrappedNFT.getAddress(), 3000, 5000, owner.address);
    //     // console.log("\tsuccess swap token0 for exact token1 ", amountOut);
        
    //     // user after status 
    //     let cc = await wrappedNFT.balanceOf(owner.address);
    //     let dd = await wrappedNFTProxy.balanceOf(owner.address);

    //     console.log("\n\tafter user wrappedNFTProxy --- ", dd);
    //     console.log("\tafter user wrappedNFT +++ 3000 ", cc);
    // });

    // it("should calculate total wrappedNFTProxy amount and should add liquidity with wrappedNFTProxy (Must call first, Vault Initializer) ", async function () {
    //     let amountwrappedNFTProxy1 = await tokenVault.getTotalAmountOfwrappedNFTProxyForLiquidity(100000, 1000); //spc-100000, ratio-1:1
    //     let amountwrappedNFTProxy2 = await tokenVault.getTotalAmountOfwrappedNFTProxyForLiquidity(100, 1852000); //spc-100, ratio-1:1852
    //     let totalwrappedNFTProxy = amountwrappedNFTProxy1 + amountwrappedNFTProxy2;
    //     expect(totalwrappedNFTProxy.toString()).to.equal("285200");

    //     console.log("\tSPC amount : 100000");
    //     console.log("\ttotal wrappedNFTProxy1 amount: ", amountwrappedNFTProxy1);
    //     console.log("\tWETH amount: 100");
    //     console.log("\ttotal wrappedNFTProxy2 amount: ", amountwrappedNFTProxy2);
    //     console.log("\ttotal wrappedNFTProxy amount: ", totalwrappedNFTProxy);
    // });

    // it("should autoconvert native reward and vault token", async function () {
    //     let initialVaultSPC = await wrappedNFT.balanceOf(await tokenVault.getAddress());
    //     let intiailUserwrappedNFTProxy = await wrappedNFTProxy.balanceOf(owner.address);

    //     console.log("\tVault initial SPC amount ", initialVaultSPC);
    //     console.log("\tUser initial wrappedNFTProxy amount ", intiailUserwrappedNFTProxy);

    //     let {amountSPC, amountETH, amountwrappedNFTProxy} = await tokenVault.autoConvertNativeRewardTowrappedNFTProxy(20000, 20000, owner.address, 50);
    //     console.log("\tsuccess autoconvert ", amountSPC, amountETH, amountwrappedNFTProxy);

    //     let afterVaultSPC = await wrappedNFT.balanceOf(await tokenVault.getAddress());
    //     let afterUserwrappedNFTProxy = await wrappedNFTProxy.balanceOf(owner.address);

    //     console.log("\n\tVault after SPC amount ", afterVaultSPC);
    //     console.log("\tUser after wrappedNFTProxy amount ", afterUserwrappedNFTProxy);
    // });

    // it("should get add vault reward as wrappedNFTProxy", async function () {
    //     await tokenVault.calculateAdditionAmountOfwrappedNFTProxy(10000, 10000, 25);
    //     let amountwrappedNFTProxy = await tokenVault.getAdditionAmountOfwrappedNFTProxy();

    //     console.log("\tVault addition reward wrappedNFTProxy ", amountwrappedNFTProxy);
    // });

    // it("should get vault total reward ", async function () {
    //     await wrappedNFTProxy.mint(await tokenVault.getAddress(), 1000);
    //     let intiailUserwrappedNFTProxy = await wrappedNFTProxy.balanceOf(owner.address);
    //     console.log("\tUser initial wrappedNFTProxy amount ", intiailUserwrappedNFTProxy);

    //     let {amountSPC, amountETH, amountwrappedNFTProxy} = await tokenVault.getVaultTotalReward(100, 100, owner.address);
    //     // console.log("\tsuccess get vault total reward ", amountSPC, amountETH, amountwrappedNFTProxy);
        
    //     let afterUserwrappedNFTProxy = await wrappedNFTProxy.balanceOf(owner.address);
    //     console.log("\tUser after wrappedNFTProxy amount ", afterUserwrappedNFTProxy);

    //     let amount = await tokenVault.getAdditionAmountOfwrappedNFTProxy();
    //     console.log("\n\tVault addition reward wrappedNFTProxy ", amount);
    // });

    // it("should remove liquidity and send APY to user ", async function () {
    //     await tokenVault.withdrawwrappedNFTPair(1000);

    //     let userInfo = await tokenVault.getUserInfo(owner);
    //     console.log("\tuser address ", userInfo._address);
    //     console.log("\tuser _depositAmountOfToken0 ", userInfo._depositAmountOfToken0);
    //     console.log("\tuser _depositAmountOfToken1 ", userInfo._depositAmountOfToken1);
    //     console.log("\tuser _lastDepositedTime ", userInfo._lastDepositedTime);
    //     console.log("\tuser _lastClaimedTime ", userInfo._lastClaimedTime);
    // });

    // it("should remove liquidity and send wrappedNFT Pair to user ", async function () {
    //     await tokenVault.withdrawwrappedNFTPairToUser(1000);

    //     let userInfo = await tokenVault.getUserInfo(owner);
    //     console.log("\tuser address ", userInfo._address);
    //     console.log("\tuser _depositAmountOfToken0 ", userInfo._depositAmountOfToken0);
    //     console.log("\tuser _depositAmountOfToken1 ", userInfo._depositAmountOfToken1);
    //     console.log("\tuser _lastDepositedTime ", userInfo._lastDepositedTime);
    //     console.log("\tuser _lastClaimedTime ", userInfo._lastClaimedTime);
    // });

    // it("should get treasury info ", async function () {
    //     let {treasury, spcAmount, wethAmount} = await tokenVault.getTreasuryTotalPF(await wrappedNFT.getAddress(), await wrappedNFTProxy.getAddress());
    //     console.log("\tTreasury address ", treasury);
    //     console.log("\tTreasury SPC amount ", spcAmount);
    //     console.log("\tTreasury WETH amount ", wethAmount);
    // });

    // it("should get performance fee from uniswapV2 ", async function () {
    //     let {token0, token1} = await tokenVault.autoclaimPerformanceFee(await wrappedNFT.getAddress(), await wrappedNFTProxy.getAddress(), 1500);
    //     console.log("\tsuccess remove liquidity", token0, token1);
        
    //     let a = await wrappedNFT.balanceOf(await tokenVault.getAddress());
    //     let b = await wrappedNFTProxy.balanceOf(await tokenVault.getAddress());

    //     console.log("\twrappedNFT ", a);
    //     console.log("\twrappedNFTProxy ", b);
    // });

    // it("should claim user fee ", async function () {
    //     await tokenVault.claimUserFee(await wrappedNFT.getAddress(), await wrappedNFTProxy.getAddress(), 1000, owner.address);

    //     let userInfo = await tokenVault.getUserInfo(owner);
    //     console.log("\tuser address ", userInfo._address);
    //     console.log("\tuser _depositAmountOfToken0 ", userInfo._depositAmountOfToken0);
    //     console.log("\tuser _depositAmountOfToken1 ", userInfo._depositAmountOfToken1);
    //     console.log("\tuser _lastDepositedTime ", userInfo._lastDepositedTime);
    //     console.log("\tuser _lastClaimedTime ", userInfo._lastClaimedTime);
    // });

    // it("should autoclaim every user fee ", async function () {

    //     await tokenVault.autoClaimUserFee(await wrappedNFT.getAddress(), await wrappedNFTProxy.getAddress(), 1000);

    //     let allUser: any[] = await tokenVault.getAllUsers();
    //     for (let i = 0;  i < allUser.length;  i++) {
    //         let userInfo = await tokenVault.getUserInfo(allUser[i]._address);
    //         console.log("\tuser ", i+1 ,"address ", userInfo._address);
    //         console.log("\tuser ", i+1 ,"_depositAmountOfToken0 ", userInfo._depositAmountOfToken0);
    //         console.log("\tuser ", i+1 ,"_depositAmountOfToken1 ", userInfo._depositAmountOfToken1);
    //         console.log("\tuser ", i+1 ,"_lastDepositedTime ", userInfo._lastDepositedTime);
    //         console.log("\tuser ", i+1 ,"_lastClaimedTime ", userInfo._lastClaimedTime);
    //     }
    // });
    
    // it("should add user info (wallet address, depositAmount) ", async function () {
    //     await tokenVault.addUser(user1.address, 1000, 1000, 1694018928);
    //     await tokenVault.addUser(user2.address, 2000, 2000, 1694018928);
    //     // await tokenVault.addUser(user3.address, 3000, 3000);

    //     let user1Info = await tokenVault.getUserInfo(user1.address);
    //     let user2Info = await tokenVault.getUserInfo(user2.address);
    //     let ownerInfo = await tokenVault.getUserInfo(owner.address);
        
    //     expect(user1Info._depositAmountOfToken0.toString()).to.equal("1000");
    //     expect(user2Info._depositAmountOfToken0.toString()).to.equal("2000");
    //     // expect(user3Info._depositAmountOfToken0.toString()).to.equal("3000");

    //     console.log("\n\tuser1 address : ", user1.address);
    //     console.log("\tuser1 deposit amount : ", user1Info._depositAmountOfToken0);
    //     console.log("\n\tuser2 address : ", user2.address);
    //     console.log("\tuser2 deposit amount : ", user2Info._depositAmountOfToken0);
    //     // console.log("\n\tuser3 address : ", user3.address);
    //     // console.log("\tuser3 deposit amount : ", user3Info._depositAmountOfToken0);
    //     console.log("\n\n\n");

    //     let allUser: any[] = await tokenVault.getAllUsers();
    //     for (let i = 0;  i < allUser.length;  i++) {
    //         console.log("\n\tuser" + i + " address : ", allUser[i]._address);
    //         console.log("\tuser" + i + " deposit toeken0 amount : ", allUser[i]._depositAmountOfToken0);
    //     }

    //     console.log("\tuser1 address is vault user address. - ", await tokenVault.isVaultUser(user1.address));
    //     console.log("\tuser3 address is vault user address. - ", await tokenVault.isVaultUser(user3.address));

    //     console.log("\n\towner last deposited time ", ownerInfo._lastDepositedTime);
    //     console.log("\n\towner last claimed time ", ownerInfo._lastClaimedTime);
    // });
});