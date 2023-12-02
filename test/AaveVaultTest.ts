import { ethers } from "hardhat";
import { expect } from "chai";
import { Contract } from "ethers"

describe("Aave Vault Test", function () {
    let asset:Contract;
    let xxx: Contract;
    let aaveVault: Contract;
    let owner: any;
    let user: any;
    let user1: any;
    let user2: any;
    let user3: any;
    
    it("deployment", async function() { // beforeEach(async function() {
        // Get the first account as the owner
        [owner, user, user1, user2, user3] = await ethers.getSigners();
        console.log("\tAccount address\t", await owner.address);

        const AssetToken = await ethers.getContractFactory("SpaceCredit");
        asset = await AssetToken.deploy();
        console.log("\tTetherToken address\t", await asset.getAddress());

        const XXXToken = await ethers.getContractFactory("XXXToken");
        xxx = await XXXToken.deploy();
        console.log("\tXXX address\t", await xxx.getAddress());

        // Deploy Aave Vault contract
        const AaveVault = await ethers.getContractFactory("AaveVault");
        aaveVault = await AaveVault.deploy(await asset.getAddress(), "vaultUSDT", "xUSDT");
        console.log("\tvaultUSDT address\t", await aaveVault.getAddress());
    });

    it("get vault name and symbol", async function() {
        expect(await aaveVault.getVaultName()).to.equal("vaultUSDT");
        expect(await aaveVault.getVaultSymbol()).to.equal("xUSDT");
        console.log("\tVault Name:\t", await aaveVault.getVaultName());
        console.log("\tVault Symbol:\t ", await aaveVault.getVaultSymbol());
    });

    it("get total asset amount of vault and user", async function() {
        expect((await aaveVault.totalAssets()).toString()).to.equal("0");
        expect((await aaveVault.totalAssetsOfUser(owner)).toString()).to.equal("1000000000000000000000000000");
        console.log("\tinitial asset amount of user:\t", await aaveVault.totalAssetsOfUser(owner));
        console.log("\tinitial asset amount of vault:\t", await aaveVault.totalAssets());
    });

    it("should deposit assets and update the balanceOfShare", async function () {
        await asset.approve(await aaveVault.getAddress(), ethers.parseEther("100"));
        await aaveVault._deposit(ethers.parseEther("100"));
        expect(await aaveVault.balanceOfShare(owner)).to.equal(ethers.parseEther("100"));
        console.log("\tuser share amount\t", await aaveVault.balanceOfShare(owner));
    });

    it("should withdraw assets and update the balanceOfShare", async function () {
        const shareToWithdraw = ethers.parseEther("50");
        await aaveVault._withdraw(shareToWithdraw, user.address);
        
        // Check that balanceOfShare mapping was updated correctly
        expect(await aaveVault.balanceOfShare(owner.address)).to.equal(ethers.parseEther("50"));
        // Check that the user received the contract amount of assets
        expect(await asset.balanceOf(user.address)).to.equal(ethers.parseEther("55"));
        console.log("\tSuccess withdraw 55 xUSDT from vault (Test APY: 10%)");
    });

    // it("should set pancakeswap factory", async function() {
    //     let factory = '0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9';
    //     await aaveVault.setPancakeFactoryAddress(factory);
    //     console.log("\tpancakeswap factory address is ", await aaveVault.getPancakeFactoryAddress());
    // });

    // it("should set pancakeswap router", async function() {
    //     let router = '0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9';
    //     await aaveVault.setPancakeRouterAddress(router);
    //     console.log("\tpancakeswap router address is ", await aaveVault.getPancakeRouterAddress());
    // });

    // it("should set vault name and symbol", async function() {
    //     await aaveVault.setVaultName("Vault Token Name");
    //     console.log("\tvault name is ", await aaveVault.getVaultName());

    //     await aaveVault.setVaultSymbol("VTC");
    //     console.log("\tvault symbol is ", await aaveVault.getVaultSymbol());
    // });

    // it("should set several fees like PF, CR, PR", async function () {
    //     await aaveVault.setPerformanceFee(20);
    //     console.log("\tPF is ", await aaveVault.getPerformanceFee());

    //     await aaveVault.setConversionRate(50);
    //     console.log("\tCR is ", await aaveVault.getConversionRate());

    //     await aaveVault.setPercentRate(25);
    //     console.log("\tPR is ", await aaveVault.getPercentRate());
    // });

    // it("should set token0, token1, xxx, treasury address", async function() {
    //     await aaveVault.setToken0Address(await asset.getAddress());
    //     console.log("\ttoken0  address is ", await aaveVault.getToken0Address());

    //     await aaveVault.setToken1Address(await xxx.getAddress());
    //     console.log("\ttoken1  address is ", await aaveVault.getToken1Address());

    //     await aaveVault.setXXXAddress(await xxx.getAddress());
    //     console.log("\txxx address is ", await aaveVault.getXXXAddress());

    //     await aaveVault.setTreasuryAddress(await asset.getAddress());
    //     console.log("\ttreasury  address is ", await aaveVault.getTreasuryAddress());
    // });

   

    // it("should exist pair address for spc and xxx", async function () {
    //     let pairAddress = await aaveVault.getPairAddress(await asset.getAddress(), await xxx.getAddress());
    //     console.log("\tBIC-XXX pair address ", pairAddress);
    // })

    // it("should get reserve amounts for spc and xxx", async function () {
    //     let {spcAmount, xxxAmount} = await aaveVault.getReserveAmounts(await asset.getAddress(), await xxx.getAddress());
    //     console.log("\tBIC reserve amount ", spcAmount);
    //     console.log("\tXXX reserve amount ", xxxAmount);
    // });

    // it("should deposit asset pair to vault", async function () {
    //     let vaultLP = await aaveVault.balanceOf(owner.address);
    //     let uniLP = await aaveVault.getTVL();

    //     console.log("\tUser original vBIC-WBNB amount ", vaultLP);
    //     console.log("\tVault original Uni LP TVL amount ", uniLP);

    //     // Approve the tokens for transfer
    //     const vaultAddress = await aaveVault.getAddress();
        
    //     await asset.approve(vaultAddress, 100000);
    //     await xxx.approve(vaultAddress, 100000);

    //     await aaveVault.depositAssetPair(100000, 100000); 

    //     let userInfo = await aaveVault.getUserInfo(owner);
    //     console.log("\tuser address ", userInfo._address);
    //     console.log("\tuser _depositAmountOfToken0 ", userInfo._depositAmountOfToken0);
    //     console.log("\tuser _depositAmountOfToken1 ", userInfo._depositAmountOfToken1);
    //     console.log("\tuser _lastDepositedTime ", userInfo._lastDepositedTime);
    //     console.log("\tuser _lastClaimedTime ", userInfo._lastClaimedTime);
    // });

    // it("should preview swap output amount without doing swap ", async function () {
    //     let output = await aaveVault.previewSwapAmountOut(XXX, BIC, 10000);
    //     console.log("\tpreview swap input amount 10000");
    //     console.log("\tpreview swap output amount ", output);
    // });

    // it("should swap exact token0 for token1 (XXX-BIC) on uniswapV2", async function () {
    //     // User current status
    //     let c = await asset.balanceOf(owner.address);
    //     let d = await xxx.balanceOf(owner.address);

    //     console.log("\tuser xxx ", d);
    //     console.log("\tuser asset ", c);
    
    //     // User -> Vault (XXX -> BIC)
    //     await xxx.approve(await aaveVault.getAddress(), 10000);
    //     await xxx.transfer(await aaveVault.getAddress(), 10000);

    //     // Pancake -> Vault -> User (asset amountOut)
    //     let amountOut = await aaveVault.swapExactToken0ForToken1(await xxx.getAddress(), await asset.getAddress(), 10000, 1, owner.address);
        
    //     // user after status 
    //     let cc = await asset.balanceOf(owner.address);
    //     let dd = await xxx.balanceOf(owner.address);

    //     console.log("\n\tafter user xxx --- ", dd);
    //     console.log("\tafter user asset +++ ", cc);
    // });

    // it("should swap token0 for exact token1 (XXX-BIC) on uniswapV2", async function() {
    //     // User current status
    //     let c = await asset.balanceOf(owner.address);
    //     let d = await xxx.balanceOf(owner.address);

    //     console.log("\tuser xxx ", d);
    //     console.log("\tuser asset ", c);
    
    //     // User -> Vault (XXX -> BIC)
    //     await xxx.approve(await aaveVault.getAddress(), 10000);
    //     await xxx.transfer(await aaveVault.getAddress(), 10000);

    //     // User -> Pancake : xxx 5000  
    //     // Pancake -> User : asset 3000 (refund left xxx)
    //     let amountOut = await aaveVault.swapToken0ForExactToken1(await xxx.getAddress(), await asset.getAddress(), 3000, 5000, owner.address);
    //     // console.log("\tsuccess swap token0 for exact token1 ", amountOut);
        
    //     // user after status 
    //     let cc = await asset.balanceOf(owner.address);
    //     let dd = await xxx.balanceOf(owner.address);

    //     console.log("\n\tafter user xxx --- ", dd);
    //     console.log("\tafter user asset +++ 3000 ", cc);
    // });

    // it("should calculate total xxx amount and should add liquidity with xxx (Must call first, Vault Initializer) ", async function () {
    //     let amountXXX1 = await aaveVault.getTotalAmountOfXXXForLiquidity(100000, 1000); //spc-100000, ratio-1:1
    //     let amountXXX2 = await aaveVault.getTotalAmountOfXXXForLiquidity(100, 1852000); //spc-100, ratio-1:1852
    //     let totalXXX = amountXXX1 + amountXXX2;
    //     expect(totalXXX.toString()).to.equal("285200");

    //     console.log("\tBIC amount : 100000");
    //     console.log("\ttotal XXX1 amount: ", amountXXX1);
    //     console.log("\tWBNB amount: 100");
    //     console.log("\ttotal XXX2 amount: ", amountXXX2);
    //     console.log("\ttotal XXX amount: ", totalXXX);
    // });

    // it("should autoconvert native reward and vault token", async function () {
    //     let initialVaultBIC = await asset.balanceOf(await aaveVault.getAddress());
    //     let intiailUserXXX = await xxx.balanceOf(owner.address);

    //     console.log("\tVault initial BIC amount ", initialVaultBIC);
    //     console.log("\tUser initial XXX amount ", intiailUserXXX);

    //     let {amountBIC, amountETH, amountXXX} = await aaveVault.autoConvertNativeRewardToXXX(20000, 20000, owner.address, 50);
    //     console.log("\tsuccess autoconvert ", amountBIC, amountETH, amountXXX);

    //     let afterVaultBIC = await asset.balanceOf(await aaveVault.getAddress());
    //     let afterUserXXX = await xxx.balanceOf(owner.address);

    //     console.log("\n\tVault after BIC amount ", afterVaultBIC);
    //     console.log("\tUser after XXX amount ", afterUserXXX);
    // });

    // it("should get add vault reward as XXX", async function () {
    //     await aaveVault.calculateAdditionAmountOfXXX(10000, 10000, 25);
    //     let amountXXX = await aaveVault.getAdditionAmountOfXXX();

    //     console.log("\tVault addition reward XXX ", amountXXX);
    // });

    // it("should get vault total reward ", async function () {
    //     await xxx.mint(await aaveVault.getAddress(), 1000);
    //     let intiailUserXXX = await xxx.balanceOf(owner.address);
    //     console.log("\tUser initial XXX amount ", intiailUserXXX);

    //     let {amountBIC, amountETH, amountXXX} = await aaveVault.getVaultTotalReward(100, 100, owner.address);
    //     // console.log("\tsuccess get vault total reward ", amountBIC, amountETH, amountXXX);
        
    //     let afterUserXXX = await xxx.balanceOf(owner.address);
    //     console.log("\tUser after XXX amount ", afterUserXXX);

    //     let amount = await aaveVault.getAdditionAmountOfXXX();
    //     console.log("\n\tVault addition reward XXX ", amount);
    // });

    // it("should remove liquidity and send APY to user ", async function () {
    //     await aaveVault.withdrawAssetPair(1000);

    //     let userInfo = await aaveVault.getUserInfo(owner);
    //     console.log("\tuser address ", userInfo._address);
    //     console.log("\tuser _depositAmountOfToken0 ", userInfo._depositAmountOfToken0);
    //     console.log("\tuser _depositAmountOfToken1 ", userInfo._depositAmountOfToken1);
    //     console.log("\tuser _lastDepositedTime ", userInfo._lastDepositedTime);
    //     console.log("\tuser _lastClaimedTime ", userInfo._lastClaimedTime);
    // });

    // it("should remove liquidity and send Asset Pair to user ", async function () {
    //     await aaveVault.withdrawAssetPairToUser(1000);

    //     let userInfo = await aaveVault.getUserInfo(owner);
    //     console.log("\tuser address ", userInfo._address);
    //     console.log("\tuser _depositAmountOfToken0 ", userInfo._depositAmountOfToken0);
    //     console.log("\tuser _depositAmountOfToken1 ", userInfo._depositAmountOfToken1);
    //     console.log("\tuser _lastDepositedTime ", userInfo._lastDepositedTime);
    //     console.log("\tuser _lastClaimedTime ", userInfo._lastClaimedTime);
    // });

    // it("should get treasury info ", async function () {
    //     let {treasury, spcAmount, wethAmount} = await aaveVault.getTreasuryTotalPF(await asset.getAddress(), await xxx.getAddress());
    //     console.log("\tTreasury address ", treasury);
    //     console.log("\tTreasury BIC amount ", spcAmount);
    //     console.log("\tTreasury WBNB amount ", wethAmount);
    // });

    // it("should get performance fee from uniswapV2 ", async function () {
    //     let {token0, token1} = await aaveVault.autoclaimPerformanceFee(await asset.getAddress(), await xxx.getAddress(), 1500);
    //     console.log("\tsuccess remove liquidity", token0, token1);
        
    //     let a = await asset.balanceOf(await aaveVault.getAddress());
    //     let b = await xxx.balanceOf(await aaveVault.getAddress());

    //     console.log("\tasset ", a);
    //     console.log("\txxx ", b);
    // });

    // it("should claim user fee ", async function () {
    //     await aaveVault.claimUserFee(await asset.getAddress(), await xxx.getAddress(), 1000, owner.address);

    //     let userInfo = await aaveVault.getUserInfo(owner);
    //     console.log("\tuser address ", userInfo._address);
    //     console.log("\tuser _depositAmountOfToken0 ", userInfo._depositAmountOfToken0);
    //     console.log("\tuser _depositAmountOfToken1 ", userInfo._depositAmountOfToken1);
    //     console.log("\tuser _lastDepositedTime ", userInfo._lastDepositedTime);
    //     console.log("\tuser _lastClaimedTime ", userInfo._lastClaimedTime);
    // });

    // it("should autoclaim every user fee ", async function () {

    //     await aaveVault.autoClaimUserFee(await asset.getAddress(), await xxx.getAddress(), 1000);

    //     let allUser: any[] = await aaveVault.getAllUsers();
    //     for (let i = 0;  i < allUser.length;  i++) {
    //         let userInfo = await aaveVault.getUserInfo(allUser[i]._address);
    //         console.log("\tuser ", i+1 ,"address ", userInfo._address);
    //         console.log("\tuser ", i+1 ,"_depositAmountOfToken0 ", userInfo._depositAmountOfToken0);
    //         console.log("\tuser ", i+1 ,"_depositAmountOfToken1 ", userInfo._depositAmountOfToken1);
    //         console.log("\tuser ", i+1 ,"_lastDepositedTime ", userInfo._lastDepositedTime);
    //         console.log("\tuser ", i+1 ,"_lastClaimedTime ", userInfo._lastClaimedTime);
    //     }
    // });
    
    // it("should add user info (wallet address, depositAmount) ", async function () {
    //     await aaveVault.addUser(user1.address, 1000, 1000, 1694018928);
    //     await aaveVault.addUser(user2.address, 2000, 2000, 1694018928);
    //     // await aaveVault.addUser(user3.address, 3000, 3000);

    //     let user1Info = await aaveVault.getUserInfo(user1.address);
    //     let user2Info = await aaveVault.getUserInfo(user2.address);
    //     let ownerInfo = await aaveVault.getUserInfo(owner.address);
        
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

    //     let allUser: any[] = await aaveVault.getAllUsers();
    //     for (let i = 0;  i < allUser.length;  i++) {
    //         console.log("\n\tuser" + i + " address : ", allUser[i]._address);
    //         console.log("\tuser" + i + " deposit toeken0 amount : ", allUser[i]._depositAmountOfToken0);
    //     }

    //     console.log("\tuser1 address is vault user address. - ", await aaveVault.isVaultUser(user1.address));
    //     console.log("\tuser3 address is vault user address. - ", await aaveVault.isVaultUser(user3.address));

    //     console.log("\n\towner last deposited time ", ownerInfo._lastDepositedTime);
    //     console.log("\n\towner last claimed time ", ownerInfo._lastClaimedTime);
    // });
});