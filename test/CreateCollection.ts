import { ethers } from "hardhat";
import { expect } from "chai";
import { Contract } from "ethers"
import WrappedCollectionNFTABI from './utils/WrappedCollectionNFT.json';

describe("Create Collection Test", function () {
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
        wrappedNFTProxy = await WrappedCollectionNFTProxy.deploy(await wrappedNFT.getAddress(), await wrap.getAddress());
        console.log('\tWrappedCollectionNFTProxy Contract deployed at:', await wrappedNFTProxy.getAddress());
    });

    it("should create new collection with token name and symbol every time (proxy contract)", async function() {
        const tokenName = 'Airplane NFT';
        const tokenSymbol = 'AIRNFT';
        const description = 'This is Airplane NFT';
        const baseURICIDHash = 'ipfs://QmWV24rL61SVoTxtxiJhHcy29T7TCaF61kNCf8FgsF8Cgi';
        const placeholderImageCIDHash = '';
        // const baseURICIDHash = '';
        // const placeholderImageCIDHash = 'ipfs://QmRbTbbACGk6kVHwvsKetHy4TDRketsHsctLoi6SRSgsyK';

        const __collectionPrice = '0.5';
        const _collectionPrice = ethers.parseUnits(__collectionPrice, 'ether');
        const collectionPrice = Number(_collectionPrice).toString();
        const __mintPrice = '0.01';
        const _mintPrice = ethers.parseUnits(__mintPrice, 'ether');
        const mintPrice = Number(_mintPrice).toString();
        const royaltyFee = '500';

        const collectionFeeAddress = '0xb2530c5d8496677353166cb4E705093bD800251D';
        const mintFeeAddress = '0xA9aE05943539DCb601d343aF9193Df17be0348E3';
        const ownerAddress = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';

        const feeAddresses: string[] = [collectionFeeAddress, mintFeeAddress, ownerAddress];
    
        const tokenInfo: string[] = [tokenName, tokenSymbol, description, baseURICIDHash, placeholderImageCIDHash];
        const nftPrice: string[] = [collectionPrice, mintPrice, royaltyFee];
        const totalSupply = '10';
        const mintingType = 0; // 0 - Sequential, 1 - Random, 2 - Specify
        const revenueAddresses = [
            { to: '0xA9aE05943539DCb601d343aF9193Df17be0348E3', percentage: 5000 },
            { to: '0xb2530c5d8496677353166cb4E705093bD800251D', percentage: 3000 },
            { to: '0x9Bc62869Ad9E43d03e97b033D4991ab6f1a9B784', percentage: 2000 }
        ];
        const soulboundCollection = false;

        console.log("\towner wrap token balance ", await wrap.balanceOf(owner));
        await wrap.approve(await wrappedNFTProxy.getAddress(), collectionPrice);

        const transaction = await wrappedNFTProxy.createNewCollection(tokenInfo, nftPrice, totalSupply, mintingType, revenueAddresses, soulboundCollection, feeAddresses);
        transaction.wait().then((receipt: { hash: any; blockNumber: any; }) => {
            // console.log("Transaction hash: ", receipt.hash);
            console.log("\tBlock number: ", receipt.blockNumber);
          }).catch((error: any) => {
            console.log(error);
        });
        console.log("\tcreate new collection success ! ----------------------------------------------- first");

        const collectionAddress = await wrappedNFTProxy.getCollectionContractAddress();
        console.log("\tcollection contract address ", collectionAddress);

        const collectionAddressBalance = await wrap.balanceOf(collectionFeeAddress);
        const balance = ethers.formatEther(collectionAddressBalance);
        expect(await wrap.balanceOf(collectionFeeAddress)).to.equal(ethers.parseEther("0.5"));
        console.log("\t------ collection fee address wrap token balance after create -------", balance);
    });

    it("should set sales phase and pay mint fee ", async function () {
        const collectionAddress = await wrappedNFTProxy.getCollectionContractAddress();

        // set the sales phase 
        const _time = Date.now();
        const dropDateTime = Math.floor(_time / 1000);
        const endDateTime = dropDateTime + 1000000; // + 1000000 seconds
        const dropDateTimestamp = dropDateTime.toString();
        const endDateTimestamp = endDateTime.toString();
        const newPhase = 2; // 0 - closed, 1 - presale, 2 - public, 3 - drop date, 4 - drop and end date
        await wrappedNFTProxy.setSalePhase(collectionAddress, newPhase, dropDateTimestamp, endDateTimestamp);

        const _newSalesPhase = await wrappedNFTProxy.getSalePhase(collectionAddress);
        const newSalesPhase = Number(_newSalesPhase).toString();
        switch (newSalesPhase) {
            case '0': {
                console.log("\tCurrent phase CLOSED");
                break;
            }
            case '1': {
                console.log("\tCurrent phase PRESALE");
                break;
            }
            case '2': {
                console.log("\tCurrent phase PUBLIC");
                break;
            }
            case '3': {
                console.log("\tCurrent phase DROP_DATE");
                break;
            }
            case '4': {
                console.log("\tCurrent phase DROP_AND_END_DATE");
                break;
            }
            default: break;
        }

        const _newDropDate = await wrappedNFTProxy.getDropDate(collectionAddress);
        const newDropDateTimeStamp = parseFloat(_newDropDate) * 1000;
        const dropDate = new Date(newDropDateTimeStamp);
        console.log("\tdrop date ", dropDate.toUTCString());

        const _newEndDate = await wrappedNFTProxy.getEndDate(collectionAddress);
        const newEndDateTimeStamp = parseFloat(_newEndDate) * 1000;
        const endDate = new Date(newEndDateTimeStamp);
        console.log("\tend date ", endDate.toUTCString());

        // if (currentPhase == '0') console.log("\tmint disabled, please go on mint setting page and update saled phase!");

        // Mint sequential - collectionAddress, address to, mint amount (<totalSupply)        
        const tx = await wrappedNFTProxy.mintNFTForSequential(collectionAddress, user, '3', {
            value: ethers.parseEther("0.03"),
        });
        await tx.wait();
        const mintedAmount = await wrappedNFTProxy.getMintedAmount(collectionAddress);
        console.log("\tminted amount ---- ", mintedAmount);
        console.log("\tmint sequential success! --------------------------------------------------------- mint sequential ");

    //     // // Mint random - collectionAddress, address to, mint amount (<totalSupply)        
    //     // const tx = await wrappedNFTProxy.mintNFTForRandom(collectionAddress, user, '3', {
    //     //     value: ethers.parseEther("0.03"),
    //     // });
    //     // await tx.wait();
    //     // const mintedAmount = await wrappedNFTProxy.getMintedAmount(collectionAddress);
    //     // console.log("\tminted amount ---- ", mintedAmount);
    //     // console.log("\tmint random success! ------------------------------------------------------------------- mint random ");
        
    //     // // Mint specify - address _collection, address to, uint256[] memory tokenIds        
    //     // let tokenIds = ['1', '3', '7'];
    //     // const tx = await wrappedNFTProxy.mintNFTForSpecify(collectionAddress, user, tokenIds, {
    //     //     value: ethers.parseEther("0.03"),
    //     // });
    //     // await tx.wait();
    //     // const mintedAmount = await wrappedNFTProxy.getMintedAmount(collectionAddress);
    //     // console.log("\tminted amount ---- ", mintedAmount);
    //     // console.log("\tmint specify success! ------------------------------------------------------------------- mint specify ");

    //     // current platform mint fee balance 
    //     const platformAmount = await wrappedNFTProxy.getBalance();
    //     const pf = ethers.formatEther(platformAmount);
    //     console.log("\tcurrent platform eth amount ", pf);

    //     // current collection mint fee balance
        const collectionWithdrawBalance = await wrappedNFTProxy.getWithdrawBalance(collectionAddress);
        const collectionBalance = ethers.formatEther(collectionWithdrawBalance);
        expect(await wrappedNFTProxy.getWithdrawBalance(collectionAddress)).to.equal(ethers.parseEther("0.03"));
        console.log("\tcurrent collection withdraw balance ", collectionBalance);

    //     // withdraw collection mint fee balance to revenue addresses -------------------------------------- confirm ---------
    //     await wrappedNFTProxy.withdraw(collectionAddress);
    //     // const revenueAddresses = [
    //     //     { to: '0xA9aE05943539DCb601d343aF9193Df17be0348E3', percentage: 5000 },
    //     //     { to: '0xb2530c5d8496677353166cb4E705093bD800251D', percentage: 3000 },
    //     //     { to: '0x9Bc62869Ad9E43d03e97b033D4991ab6f1a9B784', percentage: 2000 }
    //     // ];

    //     const userBalance1 = await ethers.provider.getBalance('0xA9aE05943539DCb601d343aF9193Df17be0348E3');
    //     const userBalance2 = await ethers.provider.getBalance('0xb2530c5d8496677353166cb4E705093bD800251D');
    //     const userBalance3 = await ethers.provider.getBalance('0x9Bc62869Ad9E43d03e97b033D4991ab6f1a9B784');
    //     const ethBalance1 = ethers.formatEther(userBalance1);
    //     const ethBalance2 = ethers.formatEther(userBalance2);
    //     const ethBalance3 = ethers.formatEther(userBalance3);

    //     expect(await ethers.provider.getBalance('0xA9aE05943539DCb601d343aF9193Df17be0348E3')).to.equal(ethers.parseEther("0.015"));
    //     expect(await ethers.provider.getBalance('0xb2530c5d8496677353166cb4E705093bD800251D')).to.equal(ethers.parseEther("0.009"));
    //     expect(await ethers.provider.getBalance('0x9Bc62869Ad9E43d03e97b033D4991ab6f1a9B784')).to.equal(ethers.parseEther("0.006"));

    //     console.log("\n\tuser 1 updated eth balance ", ethBalance1);
    //     console.log("\tuser 2 updated eth balance ", ethBalance2);
    //     console.log("\tuser 3 updated eth balance ", ethBalance3);
    });

    it("should affiliate service ", async function () {
        const collectionAddress = await wrappedNFTProxy.getCollectionContractAddress();
        
    //     // ------------------ current affiliate service status -------------------
        const affiliateAddress = '0xA9aE05943539DCb601d343aF9193Df17be0348E3';
    //     const affiliateAddress_zero = '0x0000000000000000000000000000000000000000'; // if affiliate address is not set, 
    //     const affiliateInfo = await wrappedNFTProxy.getAffiliatesInfo(collectionAddress, affiliateAddress_zero);
    //     if (!affiliateInfo[0]) {
    //         console.log("\tdefault affiliate service not enabled yet ", affiliateInfo[0]);    
    //     } else {
    //         console.log("\tdefault affiliateInfo enabled ", affiliateInfo[0]);
    //         console.log("\tdefault affiliateInfo userDiscount ", affiliateInfo[1]);
    //         console.log("\tdefault affiliateInfo affiliatePercentage ", affiliateInfo[2]);
    //     }

        // ------------------- set affiliate service ----------------------------
        const userDiscount = '20'; // 20%
        const affiliatePercentage = '50'; // 50%
        await wrappedNFTProxy.setAffiliatesPercentageAndDiscount(collectionAddress, userDiscount, affiliatePercentage, affiliateAddress);

        const affiliateInfo1 = await wrappedNFTProxy.getAffiliatesInfo(collectionAddress, affiliateAddress);
        if (!affiliateInfo1[0]) {
            console.log("\tcurrent affiliate service not enabled yet ", affiliateInfo1[0]);    
        } else {
            console.log("\tcurrent affiliateInfo enabled ", affiliateInfo1[0]);
            console.log("\tcurrent affiliateInfo userDiscount ", affiliateInfo1[1]);
            console.log("\tcurrent affiliateInfo affiliatePercentage ", affiliateInfo1[2]);
        }

        // current affiliate sequential minting  (require affiliate price pay)
        const amount = '3';
        const currentUserDiscount = affiliateInfo1[1];
        const currentMintPrice = await wrappedNFTProxy.getMintFee(collectionAddress);
        const ethMintPrice = ethers.formatEther(currentMintPrice);
        const discountedPriceEth = parseFloat(ethMintPrice) * parseFloat(currentUserDiscount) / 100;
        const affiliatePriceEth = parseFloat(ethMintPrice) - discountedPriceEth;
        const affiliateEthMintFee = affiliatePriceEth * parseFloat(amount);
        console.log("\n\tuser affiliate price ", affiliateEthMintFee);

        // ------------------- mint nft with sequential and affiliate 
        const tx = await wrappedNFTProxy.mintNFTForSequentialAffiliate(collectionAddress, user1, '3', affiliateAddress, { // (address _collection, address to, uint256 amount, address affiliate)
            value: ethers.parseEther(affiliateEthMintFee.toString()),
        });
        await tx.wait();

    //     // // ------------------- mint nft with random and affiliate  (condition -  Minting type : random )
    //     // const tx = await wrappedNFTProxy.mintNFTForRandomAffiliate(collectionAddress, user1, '3', affiliateAddress, { // (address _collection, address to, uint256 amount, address affiliate)
    //     //     value: ethers.parseEther(affiliateEthMintFee.toString()),
    //     // });
    //     // await tx.wait();

    //     // // Mint specify - address _collection, address to, uint256[] memory tokenIds        
    //     // let tokenIds = ['1', '3', '7'];
    //     // const tx = await wrappedNFTProxy.mintNFTForSpecifyAffiliate(collectionAddress, user1, tokenIds, affiliateAddress, { // (address _collection, address to, uint256[] memory tokenIds, address affiliate)
    //     //     value: ethers.parseEther(affiliateEthMintFee.toString()),
    //     // });
    //     // await tx.wait();

    //     // ------------------------------------------------------------------------ platform eth balance, collection eth balance, owner balance, affiliate balance 
        const proxyBalance = await wrappedNFTProxy.getBalance();
        const proxyEthBalance = ethers.formatEther(proxyBalance);
        console.log("\n\tproxy eth balance ", proxyEthBalance);

        const collectionTotalBalance = await wrappedNFTProxy.getTotalCollectionBalance(collectionAddress);
        const totalEth = ethers.formatEther(collectionTotalBalance);
        console.log("\n\tcurrent collection total balance ", totalEth);

        const withdrawBalance = await wrappedNFTProxy.getWithdrawBalance(collectionAddress);
        const withdrawEth = ethers.formatEther(withdrawBalance);
        console.log("\tcurrent withdraw balance ", withdrawEth);

        const affiliateBalance = await wrappedNFTProxy.getPendingAffiliateBalance(collectionAddress, affiliateAddress);
        const affilateEth = ethers.formatEther(affiliateBalance);
        console.log("\tcurrent affiliate balance ", affilateEth);

        const withdrawnAmount = await wrappedNFTProxy.getWithdrawnAmount(collectionAddress);
        const withdrawnAmountEth = ethers.formatEther(withdrawnAmount);
        console.log("\tcurrent already withdrawn amount ", withdrawnAmountEth);
        
    //     // ------------------------------------------------------------------------- owner withdraw and distribute every revenue addresses confirm
    //     await wrappedNFTProxy.withdraw(collectionAddress); 
    //     // const revenueAddresses = [
    //     //     { to: '0xA9aE05943539DCb601d343aF9193Df17be0348E3', percentage: 5000 },
    //     //     { to: '0xb2530c5d8496677353166cb4E705093bD800251D', percentage: 3000 },
    //     //     { to: '0x9Bc62869Ad9E43d03e97b033D4991ab6f1a9B784', percentage: 2000 }
    //     // ];

    //     const userBalance1 = await ethers.provider.getBalance('0xA9aE05943539DCb601d343aF9193Df17be0348E3'); // 0.015 + 0.006 = 0.021
    //     const userBalance2 = await ethers.provider.getBalance('0xb2530c5d8496677353166cb4E705093bD800251D'); // 0.009 + 0.0036 = 0.0126
    //     const userBalance3 = await ethers.provider.getBalance('0x9Bc62869Ad9E43d03e97b033D4991ab6f1a9B784'); // 0.006 + 0.0024 = 0.0084
    //     const ethBalance1 = ethers.formatEther(userBalance1);
    //     const ethBalance2 = ethers.formatEther(userBalance2);
    //     const ethBalance3 = ethers.formatEther(userBalance3);

    //     expect(await ethers.provider.getBalance('0xA9aE05943539DCb601d343aF9193Df17be0348E3')).to.equal(ethers.parseEther("0.021"));
    //     expect(await ethers.provider.getBalance('0xb2530c5d8496677353166cb4E705093bD800251D')).to.equal(ethers.parseEther("0.0126"));
    //     expect(await ethers.provider.getBalance('0x9Bc62869Ad9E43d03e97b033D4991ab6f1a9B784')).to.equal(ethers.parseEther("0.0084"));

    //     console.log("\n\tuser 1 updated eth balance ", ethBalance1);
    //     console.log("\tuser 2 updated eth balance ", ethBalance2);
    //     console.log("\tuser 3 updated eth balance ", ethBalance3);

    //     // // ------------------------------------------------------------------------- affiliate withdraw only call by affiliate address  confirm
    //     // const affiliateBalancebefore = await ethers.provider.getBalance(affiliateAddress);
    //     // const affiliateBalancebeforeEth = ethers.formatEther(affiliateBalancebefore);
    //     // console.log("\n\t affiliate Balance before ------", affiliateBalancebeforeEth);

    //     // await wrappedNFTProxy.affiliateWithdraw(collectionAddress, affiliateAddress);

    //     // const affiliateBalanceafter = await ethers.provider.getBalance(affiliateAddress);
    //     // const affiliateBalanceafterEth = ethers.formatEther(affiliateBalanceafter);
    //     // console.log("\n\t affiliate Balance after ------", affiliateBalanceafterEth);
    });

    // it("should send airdrop service ", async function () {
    //     const collectionAddress = await wrappedNFTProxy.getCollectionContractAddress();
        
    //     // ------------------------------------------ Manage Airdrops/Free minting sequential ----------------------------- regardless current phase 
    //     console.log("\tcurrent Minted NFT ", await wrappedNFTProxy.getMintedAmount(collectionAddress));
    //     console.log("\tcurrent NFTs left ", await wrappedNFTProxy.getLeftAmount(collectionAddress));

    //     const airdropAddresses = [
    //         { to: '0xA9aE05943539DCb601d343aF9193Df17be0348E3', amount: 2 },
    //         { to: '0xb2530c5d8496677353166cb4E705093bD800251D', amount: 1 },
    //         { to: '0x9Bc62869Ad9E43d03e97b033D4991ab6f1a9B784', amount: 1 }
    //     ];
    //     const soulbound = false;

    //     await wrappedNFTProxy.airdropSequential(collectionAddress, airdropAddresses, soulbound);

    //     const airdropInfo = await wrappedNFTProxy.getAirdropAddressArray(collectionAddress);
    //     for (let i = 0 ; i< airdropInfo.length; i++) {
    //         console.log("\tairdrop ", i, ": address ", airdropInfo[i].to, "\t amount ", airdropInfo[i].amount);
    //     }

    //     console.log("\tupdated Minted NFT ", await wrappedNFTProxy.getMintedAmount(collectionAddress));
    //     console.log("\tupdated NFTs left ", await wrappedNFTProxy.getLeftAmount(collectionAddress));

    //     // // ------------------------------------------ Manage Airdrops/Free minting random -----------------------------
    //     // console.log("\tcurrent Minted NFT ", await wrappedNFTProxy.getMintedAmount(collectionAddress));
    //     // console.log("\tcurrent NFTs left ", await wrappedNFTProxy.getLeftAmount(collectionAddress));

    //     // const airdropAddresses = [
    //     //     { to: '0xA9aE05943539DCb601d343aF9193Df17be0348E3', amount: 2 },
    //     //     { to: '0xb2530c5d8496677353166cb4E705093bD800251D', amount: 1 },
    //     //     { to: '0x9Bc62869Ad9E43d03e97b033D4991ab6f1a9B784', amount: 1 }
    //     // ];
    //     // const soulbound = false;

    //     // await wrappedNFTProxy.airdropRandom(collectionAddress, airdropAddresses, soulbound);

    //     // const airdropInfo = await wrappedNFTProxy.getAirdropAddressArray(collectionAddress);
    //     // for (let i = 0 ; i< airdropInfo.length; i++) {
    //     //     console.log("\tairdrop ", i, ": address ", airdropInfo[i].to, "\t amount ", airdropInfo[i].amount);
    //     // }

    //     // console.log("\tupdated Minted NFT ", await wrappedNFTProxy.getMintedAmount(collectionAddress));
    //     // console.log("\tupdated NFTs left ", await wrappedNFTProxy.getLeftAmount(collectionAddress));

    //     // // ------------------------------------------ Manage Airdrops/Free minting specify -----------------------------
    //     // console.log("\tcurrent Minted NFT ", await wrappedNFTProxy.getMintedAmount(collectionAddress));
    //     // console.log("\tcurrent NFTs left ", await wrappedNFTProxy.getLeftAmount(collectionAddress));

    //     // const airdropAddresses = [
    //     //     { to: '0xA9aE05943539DCb601d343aF9193Df17be0348E3', amount: 2 },
    //     //     { to: '0xb2530c5d8496677353166cb4E705093bD800251D', amount: 1 },
    //     //     { to: '0x9Bc62869Ad9E43d03e97b033D4991ab6f1a9B784', amount: 1 }
    //     // ];
    //     // let tokenIds = ['1', '3', '7', '10']; // if id is 0, 11(more than collection size) error , also tokenIds.length = airdropAddress total amount 
    //     // const soulbound = false;

    //     // await wrappedNFTProxy.airdropSpecify(collectionAddress, airdropAddresses, tokenIds, soulbound);

    //     // const airdropInfo = await wrappedNFTProxy.getAirdropAddressArray(collectionAddress);
    //     // for (let i = 0 ; i< airdropInfo.length; i++) {
    //     //     console.log("\tairdrop ", i, ": address ", airdropInfo[i].to, "\t amount ", airdropInfo[i].amount);
    //     // }

    //     // console.log("\tupdated Minted NFT ", await wrappedNFTProxy.getMintedAmount(collectionAddress));
    //     // console.log("\tupdated NFTs left ", await wrappedNFTProxy.getLeftAmount(collectionAddress));
    // });

    // it("should transfer collection ownership to new user ", async function () {
    //     const collectionAddress = await wrappedNFTProxy.getCollectionContractAddress();
    //     const wrappedNFTContract = new ethers.Contract(collectionAddress, WrappedCollectionNFTABI, owner);

    //     const newOwner = '0x9Bc62869Ad9E43d03e97b033D4991ab6f1a9B784';
    //     await wrappedNFTContract.approve(newOwner, '0');
    //     await wrappedNFTContract.transferCollectionOwnership('0x9Bc62869Ad9E43d03e97b033D4991ab6f1a9B784');
    //     console.log("\tupdated collection owner address ", await wrappedNFTProxy.getOwnerAddress(collectionAddress));
    // });

    it("should get total minted token ids of current collection ", async function() {
        const collectionAddress = await wrappedNFTProxy.getCollectionContractAddress();
        const tokenIds = await wrappedNFTProxy.getTotalMintedTokenIds(collectionAddress);
        
        console.log("\tminted token ids are ");
        for (let i = 0; i < tokenIds.length; i++) {
            console.log("\t", i);
        }
    });

    it("should set salesPhase and presale whitelist addresses with own mint price ", async function () {
        const collectionAddress = await wrappedNFTProxy.getCollectionContractAddress();
       
        // ------------------------ Set whitelist information ----------------
        const whitelistInfo = [
            { to: '0xA9aE05943539DCb601d343aF9193Df17be0348E3', mintFee: ethers.parseEther('0.01'), maxAmount: '5', soulbound: true },
            { to: '0xb2530c5d8496677353166cb4E705093bD800251D', mintFee: ethers.parseEther('0.02'), maxAmount: '3', soulbound: false },
            { to: owner, mintFee: ethers.parseEther('0.03'), maxAmount: '3', soulbound: false }
        ];
        await wrappedNFTProxy.setWhitelistInfo(collectionAddress, whitelistInfo);

        const currentWhitelistInfo = await wrappedNFTProxy.getWhitelistInfo(collectionAddress);
        for (let i = 0; i < currentWhitelistInfo.length; i++) {
            let _to = currentWhitelistInfo[i].to;
            let _mintFee = currentWhitelistInfo[i].mintFee;
            let _maxAmount = currentWhitelistInfo[i].maxAmount;
            let _soulbound = currentWhitelistInfo[i].soulbound;

            console.log("\twhitelist ", i, " : address ", _to, " mintFee ", _mintFee, " maxAmount ", _maxAmount, " soulbound ", _soulbound);
        }

        // set the sales phase 
        const _time = Date.now();
        const dropDateTime = Math.floor(_time / 1000);
        const endDateTime = dropDateTime + 1000000; // + 1000000 seconds
        const dropDateTimestamp = dropDateTime.toString();
        const endDateTimestamp = endDateTime.toString();
        const newPhase = 1; // 0 - closed, 1 - presale, 2 - public, 3 - drop date, 4 - drop and end date
        await wrappedNFTProxy.setSalePhase(collectionAddress, newPhase, dropDateTimestamp, endDateTimestamp);

        // check presale is active 
        const currentSalePhase = await wrappedNFTProxy.getSalePhase(collectionAddress);
        if(parseInt(currentSalePhase) != 1) {
            console.log("\tpresale is not activated");
        } else {
            console.log("\tpresale is activated");
        }

        // check user address is in the whitelist list
        const userAddress1 = '0xA9aE05943539DCb601d343aF9193Df17be0348E3';
        const userAddress2 = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
        const status1 = await wrappedNFTProxy.isWhitelisted(collectionAddress, userAddress1);
        const status2 = await wrappedNFTProxy.isWhitelisted(collectionAddress, userAddress2);
        console.log("\tuser 1 whitelisted enabled ", status1); // true
        console.log("\tuser 2 whitelisted enabled ", status2); // false

        // get user whitelist info after check it
        const userWhitelist = await wrappedNFTProxy.getUserWhitelist(collectionAddress, owner);
        console.log("\tuser whitelist info : address ", userWhitelist.to, " mintFee ", userWhitelist.mintFee, " maxAmount ", userWhitelist.maxAmount, " soulbound ", userWhitelist.soulbound);

        const tx = await wrappedNFTProxy.mintPresale(collectionAddress, owner, '3', {
            value: ethers.parseEther("0.09"),
        });
        await tx.wait();
        const mintedAmount = await wrappedNFTProxy.getMintedAmount(collectionAddress);
        console.log("\tminted amount ---- ", mintedAmount);

        const currentWithdrawBalance = await wrappedNFTProxy.getWithdrawBalance(collectionAddress);
        const balanceEth = ethers.formatEther(currentWithdrawBalance);
        console.log("\tcurrent withdraw balance ", balanceEth);

        // withdraw collection mint fee balance to revenue addresses -------------------------------------- confirm ---------
        await wrappedNFTProxy.withdraw(collectionAddress);
        // const revenueAddresses = [
        //     { to: '0xA9aE05943539DCb601d343aF9193Df17be0348E3', percentage: 5000 },
        //     { to: '0xb2530c5d8496677353166cb4E705093bD800251D', percentage: 3000 },
        //     { to: '0x9Bc62869Ad9E43d03e97b033D4991ab6f1a9B784', percentage: 2000 }
        // ];

        const userBalance1 = await ethers.provider.getBalance('0xA9aE05943539DCb601d343aF9193Df17be0348E3');
        const userBalance2 = await ethers.provider.getBalance('0xb2530c5d8496677353166cb4E705093bD800251D');
        const userBalance3 = await ethers.provider.getBalance('0x9Bc62869Ad9E43d03e97b033D4991ab6f1a9B784');
        const ethBalance1 = ethers.formatEther(userBalance1);
        const ethBalance2 = ethers.formatEther(userBalance2);
        const ethBalance3 = ethers.formatEther(userBalance3);
        console.log("\n\tuser 1 updated eth balance ", ethBalance1);
        console.log("\tuser 2 updated eth balance ", ethBalance2);
        console.log("\tuser 3 updated eth balance ", ethBalance3);

        // get revenue address array
        const revenueArray = await wrappedNFTProxy.getRevenueAddressArray(collectionAddress);
        for (let i = 0; i < revenueArray.length; i ++) {
            console.log("\trevenue ", i, " address ", revenueArray[i].to, " percent ", parseInt(revenueArray[i].percentage)/100, "%");
        }

        // set creator fee enforcement
        await wrappedNFTProxy.setCreatorFeeEnforcemented(collectionAddress, true);
        const currentStatus = await wrappedNFTProxy.getCreatorFeeEnforcemented(collectionAddress);
        console.log("\tcurrent enforcement status ", currentStatus);


        // Utils page ----------------- token id -> owner address
        const tokenId = '3';
        const userAddress = await wrappedNFTProxy.getOwnerOf(collectionAddress, tokenId);
        console.log("\ttoken id 3  => owner address ", userAddress);
    });


});