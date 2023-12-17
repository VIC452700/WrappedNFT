import React from 'react';
import { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import WRAP from './utils/WRAP.json';
import WrappedCollectionNFT from './utils/WrappedCollectionNFT.json';
import WrappedCollectionNFTProxy from './utils/WrappedCollectionNFTProxy.json';

import Button from './components/Button';
import Input from './components/Input';
import './App.css';
import Web3 from 'web3';

declare let window: any;

function App() {

  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isAssetEmpty, setIsAssetEmpty] = useState<boolean | false>(false);
  const [isShareEmpty, setIsShareEmpty] = useState<boolean | false>(false);
  const [inputs, setInputs] = useState({
    Asset: '',
    Share: '',
  });
  const [account, setAccount] = useState('');
  const [token, setToken] = useState('');
  const [lpToken, setLPToken] = useState('');
  const [balance, setBalance] = useState('');

  const [vaultName, setVaultName] = useState('');
  const [vaultSymbol, setVaultSymbol] = useState('');
  const [totalAssets, setTotalAssets] = useState('');

  const [status, setStatus] = useState('0');

  // ----------- mumbai ------------------
  // const collectionNFTAddress = "0x9dEb94F880293F565AA4d70a80c6D02AAdf77867";
  // const wrapAddress  = "0xE85c3A4C40eb47C973f3eddC18AeB97eE47d8006";
  // const wrappedNFTProxyAddress = "0xf301714822A7f88907e2762c40034e5d3e5dE1F3";
  
  // ---------- bsc -----------------
  const wrapAddress  = "0xE484ae97aD9dE818d10D67B9C30c07F48EeA25B0";
  const wrapCollectionNFTAddress = "0xcBcD75ebE40Bc9e8ddBa9959cFA19c9BA0FED619"
  const wrappedNFTProxyAddress = "0x3a978E55a1E7130604407DB9a2D1a1b5521E42bF";

    const _web3 = new Web3(window.ethereum);

    const wrapToken: any = new _web3.eth.Contract(WRAP, wrapAddress);
    const wrappedNFTProxy: any = new _web3.eth.Contract(WrappedCollectionNFTProxy, wrappedNFTProxyAddress);

  useEffect(() => {
    if (window.ethereum) {
      if (window.ethereum._state.isUnlocked) {
        setIsConnected(true);
        console.log("useeffect true");
      } else {
        setIsConnected(false);
        window.alert("Please connect your Metamask wallet!");
        return;
      }
    } else {
      window.alert('Please install MetaMask');
      window.open('https://metamask.io/download.html', '_self');
    }
  }, [isConnected]);

  useEffect(() => {
    if (status == 'start') {
      apprvoeWRAP();
    }
    else if (status == '1') {
      createCollection();
    }
    else if (status == '2') {
      console.log("OK---------------------------");
      setStatus("0");
    }
  }, [status]);

  async function connectMetaMask(): Promise<void> {
    //const provider = new ethers.AlchemyProvider('https://eth-sepolia.g.alchemy.com/v2/Z66PxY86kCkFslToB82DiSM531OnIyHS');
    
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    const _web3 = new Web3(window.ethereum);
    const walletAccount: any = await _web3.eth.getAccounts();
    console.log("web3 wallet connect --------------", walletAccount[0]);

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();    
    const accountAddress = await signer.getAddress();

    // const collectionNFT = new ethers.Contract(collectionNFTAddress, WrappedCollectionNFT,  signer);
    // const proxyContract = new ethers.Contract(wrappedNFTProxyAddress, WrappedCollectionNFTProxy,  signer);
    // const wrapToken = new ethers.Contract(wrapAddress, WRAP, signer);

    // let vaultName = await shareToken.getVaultName();
    // let vaultSymbol = await shareToken.getVaultSymbol();

    // // Get balance of ETH
    const balanceWei = await provider.getBalance(accountAddress);
    const balanceEth = ethers.formatEther(balanceWei);
    // // Get balance of SPC token
    // let SpaceCreditTokenWei = await assetToken.balanceOf(accountAddress);
    // let SpaceCreditTokenEth = ethers.formatEther(SpaceCreditTokenWei);
    // // Get balance of vSPC token
    // let vSPCWei = await shareToken.balanceOf(accountAddress);
    // let vSPCEth = ethers.formatEther(vSPCWei);

    // setVaultName(vaultName);
    // setVaultSymbol(vaultSymbol);
    setAccount(accountAddress);
    setBalance(balanceEth);
    // setToken(SpaceCreditTokenEth);
    // setLPToken(vSPCEth);
  }

  const handleConnectClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    await connectMetaMask();
  };

  const handleDepositClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (inputs.Asset === '') {
      setIsAssetEmpty(true);
    } else {
      setIsAssetEmpty(false);

      event.preventDefault();

      // if(status == '0'){
      //   setStatus("start");
      // }
      
      await depositTokens(inputs.Asset);
    }
  };

  async function depositTokens(amount: string): Promise<void> {
    try {
      console.log("-----------------start  ----------------------");

      // -------------------------------------- create collection -------------------------------
      const tokenName = 'Airplane NFT';
      const tokenSymbol = 'AIRNFT';
      const description = 'This is Airplane NFT';
      const baseURICIDHash = 'ipfs://QmWV24rL61SVoTxtxiJhHcy29T7TCaF61kNCf8FgsF8Cgi';
      const placeholderImageCIDHash = '';

      const __collectionPrice = '0.5';
      const _collectionPrice = _web3.utils.toWei(__collectionPrice, 'ether');
      const collectionPrice = Number(_collectionPrice).toString();
      const __mintPrice = '0.01';
      const _mintPrice = ethers.parseUnits(__mintPrice, 'ether');
      const mintPrice = Number(_mintPrice).toString();
      const royaltyFee = '500';

      const collectionFeeAddress = '0xA9aE05943539DCb601d343aF9193Df17be0348E3';
      const mintFeeAddress = '0x9Bc62869Ad9E43d03e97b033D4991ab6f1a9B784';
      const ownerAddress = account;

      const feeAddresses: string[] = [collectionFeeAddress, mintFeeAddress, ownerAddress];
      
      const tokenInfo: string[] = [tokenName, tokenSymbol, description, baseURICIDHash, placeholderImageCIDHash];
      const nftPrice: string[] = [collectionPrice, mintPrice, royaltyFee];
      const totalSupply = '10';
      const mintingType = 1; // Sequential, random, specify
      const revenueAddresses = [
          { to: '0xA9aE05943539DCb601d343aF9193Df17be0348E3', percentage: 50 },
          { to: '0xb2530c5d8496677353166cb4E705093bD800251D', percentage: 30 },
          { to: '0x9Bc62869Ad9E43d03e97b033D4991ab6f1a9B784', percentage: 15 }
      ];
      const soulboundCollection = false;


      console.log("\towner wrap token balance ", await wrapToken.methods.balanceOf(account).call());
      await wrapToken.methods.approve(wrappedNFTProxyAddress, collectionPrice).send({ from: account });

      console.log("------------ approve ok -------------------");

      await wrappedNFTProxy.methods.createNewCollection(tokenInfo, nftPrice, totalSupply, mintingType, revenueAddresses, soulboundCollection, feeAddresses)
      .send({ from: account });

      console.log("---- create collection okay ----------------------");

      // const provider = new ethers.BrowserProvider(window.ethereum);
      // const signer = await provider.getSigner();    
      // const accountAddress = await signer.getAddress();

      // const collectionNFT = new ethers.Contract(wrapCollectionNFTAddress, WrappedCollectionNFT,  signer);
      // const wrappedNFTProxy = new ethers.Contract(wrappedNFTProxyAddress, WrappedCollectionNFTProxy,  signer);
      // const wrapToken = new ethers.Contract(wrapAddress, WRAP, signer);


      //   console.log("\towner wrap token balance ", await wrapToken.balanceOf(accountAddress));
      //   const transaction = await wrapToken.approve(await wrappedNFTProxy.getAddress(), collectionPrice);

      //   transaction.wait().then((receipt: { hash: any; blockNumber: any; }) => {
      //     wrappedNFTProxy.createNewCollection(tokenInfo, nftPrice, totalSupply, mintingType, revenueAddresses, soulboundCollection, feeAddresses).then((receipt: { hash: any; blockNumber: any; }) => {
      //         console.log("Transaction hash: ", receipt.hash);
      //         console.log("\tBlock number: ", receipt.blockNumber);
      //       }).catch((error: any) => {
      //         console.log(error);
      //     });

      //     }).catch((error: any) => {
      //       console.log(error);
      //   });

      
      // ------------------------------------------- mint nft ----------------------------------------------------
      // const collectionAddress = await wrappedNFTProxy.getCollectionContractAddress(); 
      // console.log("\tcollection contract address ", collectionAddress);

      // // check the sales phase 
      // const _salesPhase = await wrappedNFTProxy.getSalePhase(collectionAddress);
      //   const currentPhase = Number(_salesPhase).toString();
      //   switch (currentPhase) {
      //       case '0': {
      //           console.log("\tCurrent phase CLOSED");
      //           break;
      //       }
      //       case '1': {
      //           console.log("\tCurrent phase PRESALE");
      //           break;
      //       }
      //       case '2': {
      //           console.log("\tCurrent phase PUBLIC");
      //           break;
      //       }
      //       case '3': {
      //           console.log("\tCurrent phase DROP_DATE");
      //           break;
      //       }
      //       case '4': {
      //           console.log("\tCurrent phase DROP_AND_END_DATE");
      //           break;
      //       }
      //       default: break;
      //   }

      //  if (currentPhase == '0') console.log("mint disabled, please go on mint setting page and update saled phase!");
        // const newPhase = 2; // Public (Open)
        // await wrappedNFTProxy.setSalePhase(collectionAddress, newPhase);

        // Mint sequential - collectionAddress, address to, mint amount (<totalSupply)        
        // const tx = await wrappedNFTProxy.mintNFTForSequential(collectionAddress, account, '3', { // 0xfE672A2659f59e21177bD6975D5960EeaD390cE3
        //     value: ethers.parseEther("0.03"),
        // });
        // await tx.wait();
        // console.log("\tmint sequential success!");

        // const newOwner = '0x9Bc62869Ad9E43d03e97b033D4991ab6f1a9B784';
        // await collectionNFT.approve(newOwner, '0');
        // await collectionNFT.transferCollectionOwnership(newOwner);
        // console.log("\tupdated collection owner address ", await wrappedNFTProxy.getOwnerAddress(collectionAddress));
        // console.log("\taccount address ", accountAddress);
        // const _date = await wrappedNFTProxy.getCreatedDate(collectionAddress);
        // const _createdDate = Number(_date);
        // const date = new Date(_createdDate * 1000); // convert to milliseconds
        // const createDate = date.toLocaleString(); // convert to local date and time string
        // console.log("\tcontract create date ", createDate); // output: "12/7/2021, 12:00:00 AM"

        // console.log("\tcontract version ", await wrappedNFTProxy.getContractVersion(collectionAddress));
        // // minting type ... 
        // const _mintingType = await wrappedNFTProxy.getMintingType(collectionAddress);
        // const type = Number(_mintingType).toString();
        // switch (type) {
        //     case '0': {
        //         console.log("\tMinting type SEQUENTIAL");
        //         break;
        //     }
        //     case '1': {
        //         console.log("\tMinting type RANDOM");
        //         break;
        //     }
        //     case '2': {
        //         console.log("\tMinting type SPECIFY");
        //         break;
        //     }
        //     case '3': {
        //         console.log("\tMinting type CUSTOM_URI");
        //         break;
        //     }
        //     default: break;
        // }
        // console.log("\tNFT standard ERC-721");

        // const _salesPhase = await wrappedNFTProxy.getSalePhase(collectionAddress);
        // const currentPhase = Number(_salesPhase).toString();
        // switch (currentPhase) {
        //     case '0': {
        //         console.log("\tCurrent phase CLOSED");
        //         break;
        //     }
        //     case '1': {
        //         console.log("\tCurrent phase PRESALE");
        //         break;
        //     }
        //     case '2': {
        //         console.log("\tCurrent phase PUBLIC");
        //         break;
        //     }
        //     case '3': {
        //         console.log("\tCurrent phase DROP_DATE");
        //         break;
        //     }
        //     case '4': {
        //         console.log("\tCurrent phase DROP_AND_END_DATE");
        //         break;
        //     }
        //     default: break;
        // }

        // const _mintFee = await wrappedNFTProxy.getMintFee(collectionAddress);
        // const mintFee = ethers.formatEther(_mintFee);
        // console.log("\tmint fee ", mintFee);

        // const isFixed = await wrappedNFTProxy.isMetadataFixed(collectionAddress);
        // if(isFixed) {
        //     console.log("\tMetadata Fixed Fixed");
        // } else {
        //     console.log("\tMetadata Fixed Not fixed");
        // }

        // console.log("\tTotal supply ", await wrappedNFTProxy.getCollectionSize(collectionAddress));
        // console.log("\tMinted NFT ", await wrappedNFTProxy.getMintedAmount(collectionAddress));
        // console.log("\tNFTs left ", await wrappedNFTProxy.getLeftAmount(collectionAddress));
        // console.log("\tWithdraw current balance ", await wrappedNFTProxy.getWithdrawBalance(collectionAddress));
        // console.log("\tWithdrawn amount ", await wrappedNFTProxy.getWithdrawnAmount(collectionAddress));
        
        // const _royalty = await wrappedNFTProxy.getRoyaltyFee(collectionAddress);
        // const royalty = Number(_royalty) / 100;
        // console.log("\tResale Royalty ", royalty, "%");

        // console.log("\tCollection owner address ", await wrappedNFTProxy.getOwnerAddress(collectionAddress));
        // affiliates commision 
        // affiliates users discount 

        
        
        // ------------------------------------------------- mint setting --------------------------
        // const __newMintPrice = '0.3';
        // const _newMintPrice = ethers.parseUnits(__newMintPrice, 'ether');
        // const newMintPrice = Number(_newMintPrice).toString();
        // await wrappedNFTProxy.setMintFee(collectionAddress, newMintPrice);
        // const _newMintFee = await wrappedNFTProxy.getMintFee(collectionAddress);
        // const newMintFee = ethers.formatEther(_newMintFee);
        // console.log("\tupdated mint fee ", newMintFee);

      //   const maxPerAddress = '3';
      //   await wrappedNFTProxy.setMaxPerAddress(collectionAddress, maxPerAddress);
      //   console.log("\tMax per address ", await wrappedNFTProxy.getMaxPerAddress(collectionAddress));

      //   const newPhase = 2; // Public (Open)
      //   await wrappedNFTProxy.setSalePhase(collectionAddress, newPhase);
      //   const _newSalesPhase = await wrappedNFTProxy.getSalePhase(collectionAddress);
      //   const newSalesPhase = Number(_newSalesPhase).toString();
      //   switch (newSalesPhase) {
      //       case '0': {
      //           console.log("\tCurrent phase CLOSED");
      //           break;
      //       }
      //       case '1': {
      //           console.log("\tCurrent phase PRESALE");
      //           break;
      //       }
      //       case '2': {
      //           console.log("\tCurrent phase PUBLIC");
      //           break;
      //       }
      //       case '3': {
      //           console.log("\tCurrent phase DROP_DATE");
      //           break;
      //       }
      //       case '4': {
      //           console.log("\tCurrent phase DROP_AND_END_DATE");
      //           break;
      //       }
      //       default: break;
      //   }

      //   const year = 2023;
      //   const month = 11; // Note: JavaScript months are zero-based (0 = January, 1 = February, etc.)
      //   const day = 1;
      //   const hour = 10;
      //   const minute = 9;
      //   const second = 5;
      //   const dropDate = Date.UTC(year, month, day, hour - 9, minute, second); // current timezone GMT + 9, that's UTC timezone (-9)
      //   const endDate = Date.UTC(year + 1, month, day, hour - 9, minute, second + 1); // current timezone GMT + 9, that's UTC timezone (-9)
      //   const _dropDate = new Date(dropDate);
      //   const __dropDate = _dropDate.toLocaleString();  
      //   console.log("\tinput drop date ", __dropDate);

      //   const dropDateInput = dropDate/1000; // convert milliseconds to seconds (UNIX -> Solidity)
      //   const endDateInput = endDate/1000;
      //   await wrappedNFTProxy.setDropDate(collectionAddress, dropDateInput.toString());
      //   console.log("\tDrop date ", await wrappedNFTProxy.getDropDate(collectionAddress));
      //   await wrappedNFTProxy.setDropAndEndDate(collectionAddress, dropDateInput, endDateInput);
      //   console.log("\tDrop and End date(drop date) ", await wrappedNFTProxy.getDropDate(collectionAddress));
      //   console.log("\tDrop and End date(end date) ", await wrappedNFTProxy.getEndDate(collectionAddress));

        // Mint sequential - collectionAddress, to, mint amount( < totalSupply )
        // await wrappedNFTProxy.mintNFTForSequential(collectionAddress, accountAddress, '1');

        // const tx = await wrappedNFTProxy.sendTransaction({
        //   to: wrappedNFTProxyAddress,
        //   value: ethers.parseEther("0.1"),
        // });
        
        // await tx.wait();
        // console.log("Transaction successful!");

        // const __newMintPrice = '0.3';
        // const _newMintPrice = ethers.parseUnits(__newMintPrice, 'ether');
        // const newMintPrice = Number(_newMintPrice).toString();
        // await wrappedNFTProxy.setMintFee(collectionAddress, newMintPrice);

        // const _newMintFee = await wrappedNFTProxy.getMintFee(collectionAddress);
        // const newMintFee = ethers.formatEther(_newMintFee);
        // console.log("\tupdated mint fee ", newMintFee);




        // const newPhase = 2; // Public (Open)
        // await wrappedNFTProxy.setSalePhase(collectionAddress, newPhase);
        // const _newSalesPhase = await wrappedNFTProxy.getSalePhase(collectionAddress);

        // // Mint sequential - collectionAddress, address to, mint amount (<totalSupply)        
        // const tx = await wrappedNFTProxy.mintNFTForSequential(collectionAddress, accountAddress, '3', {
        //     value: ethers.parseEther("0.3"),
        // });
        // await tx.wait();
        // console.log("\tmint sequential success!");

        // const withdrawBalance = await wrappedNFTProxy.getWithdrawBalance(collectionAddress);
        // console.log("\tWithdraw current balance ", ethers.formatEther(withdrawBalance));


        // ---------------------------- withdraw --------------------------------
         // Withdraw current balance 
        //  await wrappedNFTProxy.withdraw(collectionAddress, accountAddress);
 
        //  const withdrawnAmount = await wrappedNFTProxy.getWithdrawnAmount(collectionAddress);
        //  console.log("\twithdrawn amount ", ethers.formatEther(withdrawnAmount));

        //  const withdrawBalance1 = await wrappedNFTProxy.getWithdrawBalance(collectionAddress);
        //  console.log("\tWithdraw updated balance ", ethers.formatEther(withdrawBalance1));

    } catch(error: any){
      console.log(error);
    }
  }

  const apprvoeWRAP = async () => {
    try{

      // const __collectionPrice = '0.5';
      // const _collectionPrice = _web3.utils.toWei(__collectionPrice, 'ether');
      // const collectionPrice = Number(_collectionPrice).toString();

      // console.log("\towner wrap token balance ", await wrapToken.methods.balanceOf(account).call());
      // await wrapToken.methods.approve(wrappedNFTProxyAddress, collectionPrice).send({ from: account });

      // console.log("------------ ok -------------------");


      // await shareToken.methods._deposit(amountWei).send({ from: accountAddress });

      // const provider = new ethers.BrowserProvider(window.ethereum);
      // const signer = await provider.getSigner();    
      // const accountAddress = await signer.getAddress();

      // const wrappedNFTProxy = new ethers.Contract(wrappedNFTProxyAddress, WrappedCollectionNFTProxy,  signer);
      // const wrapToken = new ethers.Contract(wrapAddress, WRAP, signer);

      // const __collectionPrice = '0.5';
      // const _collectionPrice = ethers.parseUnits(__collectionPrice, 'ether');
      // const collectionPrice = Number(_collectionPrice).toString();

      // console.log("\towner wrap token balance ", await wrapToken.balanceOf(accountAddress));
      // const tx = await wrapToken.approve(await wrappedNFTProxy.getAddress(), collectionPrice);

      // tx.wait().then((receipt: { hash: any; blockNumber: any; }) => {
        
      //   if (receipt.blockNumber != null) {
      //     setStatus('1');
      //   }
      
      // }).catch((error: any) => {
      //   console.log(error);
      //   setStatus("0");
      // }); 

      // const tx = await wrapToken.approve(await wrappedNFTProxy.getAddress(), collectionPrice);

      // // Sign the transaction
      // const signedTx = await signer.signTransaction(tx);

      // // Get the r, s, v values from the signed transaction
      // const { r, s, v } = signedTx

      // // Send the transaction with r, s, v
      // const txResponse = await wrapToken.connect(signer).approve(user, amount, { r, s, v });
      // await txResponse.wait();

      // // Split the signature to get r, s, v
      // const splitSig = ethers.utils.splitSignature(signedTxHash);

      // // Set the r, s, v values for sending the transaction
      // const r = splitSig.r;
      // const s = splitSig.s;
      // const v = splitSig.v;

      // // Send the transaction with r, s, v
      // const txResponse = await wrapToken.connect(signer).approve(user, amount, { r, s, v });
      // await txResponse.wait();

    }
    catch(error: any){
      console.log(error);
      setStatus("0");
    }
  };

  const createCollection = async () => {
    try {
      console.log("-----------------okay ----------------------");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();    
      const accountAddress = await signer.getAddress();

      const wrappedNFTProxy = new ethers.Contract(wrappedNFTProxyAddress, WrappedCollectionNFTProxy,  signer);

      // -------------------------------------- create collection -------------------------------
      const tokenName = 'Airplane NFT';
      const tokenSymbol = 'AIRNFT';
      const description = 'This is Airplane NFT';
      const baseURICIDHash = 'ipfs://QmWV24rL61SVoTxtxiJhHcy29T7TCaF61kNCf8FgsF8Cgi';
      const placeholderImageCIDHash = '';

      const __collectionPrice = '0.5';
      const _collectionPrice = ethers.parseUnits(__collectionPrice, 'ether');
      const collectionPrice = Number(_collectionPrice).toString();
      const __mintPrice = '0.01';
      const _mintPrice = ethers.parseUnits(__mintPrice, 'ether');
      const mintPrice = Number(_mintPrice).toString();
      const royaltyFee = '500';

      const collectionFeeAddress = '0xA9aE05943539DCb601d343aF9193Df17be0348E3';
      const mintFeeAddress = '0x9Bc62869Ad9E43d03e97b033D4991ab6f1a9B784';
      const ownerAddress = accountAddress;

        const feeAddresses: string[] = [collectionFeeAddress, mintFeeAddress, ownerAddress];
        
        const tokenInfo: string[] = [tokenName, tokenSymbol, description, baseURICIDHash, placeholderImageCIDHash];
        const nftPrice: string[] = [collectionPrice, mintPrice, royaltyFee];
        const totalSupply = '10';
        const mintingType = 1; // Sequential, random, specify
        const revenueAddresses = [
            { to: '0xA9aE05943539DCb601d343aF9193Df17be0348E3', percentage: 50 },
            { to: '0xb2530c5d8496677353166cb4E705093bD800251D', percentage: 30 },
            { to: '0x9Bc62869Ad9E43d03e97b033D4991ab6f1a9B784', percentage: 15 }
        ];
        const soulboundCollection = false;

        const tx = await wrappedNFTProxy.createNewCollection(tokenInfo, nftPrice, totalSupply, mintingType, revenueAddresses, soulboundCollection, feeAddresses);
        tx.wait().then((receipt: { hash: any; blockNumber: any; }) => {
          if (receipt.blockNumber != null) {
            setStatus('2');
          }
        
        }).catch((error: any) => {
          console.log(error);
          setStatus("0");
        }); 

    } catch(error: any){
      console.log(error);
      setStatus("0");
    }
  };
  
  const handleWithdrawClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (inputs.Share === '') {
      setIsShareEmpty(true);
    } else {
      setIsShareEmpty(false);
      event.preventDefault();
      await withdrawTokens(inputs.Share, account);
    }
  };

  async function withdrawTokens(shares: string, receiver: any){
    try{     
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();    
      const accountAddress = await signer.getAddress();

      const wrappedNFTProxy = new ethers.Contract(wrappedNFTProxyAddress, WrappedCollectionNFTProxy,  signer);
      const collectionAddress = await wrappedNFTProxy.getCollectionContractAddress();


       const __newMintPrice = '0.3';
        const _newMintPrice = ethers.parseUnits(__newMintPrice, 'ether');
        const newMintPrice = Number(_newMintPrice).toString();
        await wrappedNFTProxy.setMintFee(collectionAddress, newMintPrice);
        const _newMintFee = await wrappedNFTProxy.getMintFee(collectionAddress);
        const newMintFee = ethers.formatEther(_newMintFee);
        console.log("\tupdated mint fee ", newMintFee);
      
      

      // const collectionNFT = new ethers.Contract(wrapCollectionNFTAddress, WrappedCollectionNFT,  signer);
      // const wrappedNFTProxy = new ethers.Contract(wrappedNFTProxyAddress, WrappedCollectionNFTProxy,  signer);
      // const wrap = new ethers.Contract(wrapAddress, WRAP, signer);

      // const tokenName1 = 'Airplane NFT';
      //   const tokenSymbol1 = 'AIRNFT';
      //   const description1 = 'This is Airplane NFT';
      //   // --------- isTokenMetadataFixed - default: true (false use placeholder URI hash instead of base URI hash) --------------------------
      //   const isTokenMetadataFixed = true;
      //   let baseURICIDHash1: any;
      //   let placeholderImageCIDHash1: any;
      //   if (isTokenMetadataFixed) { // if isTokenMetadataFixed is true
      //       baseURICIDHash1 = 'ipfs://QmWV24rL61SVoTxtxiJhHcy29T7TCaF61kNCf8FgsF8Cgi';
      //       placeholderImageCIDHash1 = '';
      //   } else { // if isTokenMetadataFixed is false
      //       baseURICIDHash1 = '';
      //       placeholderImageCIDHash1 = 'ipfs://QmRbTbbACGk6kVHwvsKetHy4TDRketsHsctLoi6SRSgsyK';
      //   }
      //   const __collectionPrice1 = '0.5';
      //   const _collectionPrice1 = ethers.parseUnits(__collectionPrice1, 'ether');
      //   const collectionPrice1 = Number(_collectionPrice1).toString();
      //   const __mintPrice1 = '0';
      //   const _mintPrice1 = ethers.parseUnits(__mintPrice1, 'ether');
      //   const mintPrice1 = Number(_mintPrice1).toString();
      //   const royaltyFee1 = '500';
      //   const airdropInfo1 = [
      //       { to: '0xA9aE05943539DCb601d343aF9193Df17be0348E3', amount: 2 },
      //       { to: '0xb2530c5d8496677353166cb4E705093bD800251D', amount: 1 },
      //       { to: '0x9Bc62869Ad9E43d03e97b033D4991ab6f1a9B784', amount: 5 }
      //   ];
      //   const collectionFeeAddress1 = '0xb2530c5d8496677353166cb4E705093bD800251D';
      //   const mintFeeAddress1 = '0xA9aE05943539DCb601d343aF9193Df17be0348E3';
      //   const ownerAddress1 = account;
        
      //   // set function parameters
      //   const tokenInfo1: string[] = [tokenName1, tokenSymbol1, description1, baseURICIDHash1, placeholderImageCIDHash1];
      //   const nftPrice1: string[] = [collectionPrice1, mintPrice1, royaltyFee1];
      //   const soulboundCollection1 = false;
      //   const feeAddresses1: string[] = [collectionFeeAddress1, mintFeeAddress1, ownerAddress1];

      //   console.log("\towner wrap token balance ", await wrap.balanceOf(account));
      //   const transaction1 = await wrap.approve(await wrappedNFTProxy.getAddress(), collectionPrice1);
      //   transaction1.wait().then((receipt: { hash: any; blockNumber: any; }) => {
      //     console.log("\tTransaction hash: ", receipt.hash);
      //     console.log("\tBlock number: ", receipt.blockNumber);

      //     wrappedNFTProxy.createCollectionMintNFT(tokenInfo1, nftPrice1, airdropInfo1, soulboundCollection1, feeAddresses1).then((receipt: { hash: any; blockNumber: any; }) => {
      //         console.log("\tTransaction hash: ", receipt.hash);
      //         console.log("\tBlock number: ", receipt.blockNumber);
      //       }).catch((error: any) => {
      //         console.log(error);
      //     });

      //   }).catch((error: any) => {
      //     console.log(error);
      // });

        
      //   const collectionAddress1 = await wrappedNFTProxy.getCollectionContractAddress();
      //   console.log("\tedition collection contract address ", collectionAddress1);
      
    } catch(error: any){
      console.log(error);
    }
  }

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setInputs({
      ...inputs,
      [name]: value,
    });
  };
  
  return (
    <>
    <nav className="flex items-center justify-between flex-wrap bg-blue-600 p-6">
      <div className="flex items-center flex-shrink-0 text-white mr-6">
      <svg className="h-7 w-7 mr-2 text-gray-800 dark:text-white"  xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 21">
        <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M7.24 7.194a24.16 24.16 0 0 1 3.72-3.062m0 0c3.443-2.277 6.732-2.969 8.24-1.46 2.054 2.053.03 7.407-4.522 11.959-4.552 4.551-9.906 6.576-11.96 4.522C1.223 17.658 1.89 14.412 4.121 11m6.838-6.868c-3.443-2.277-6.732-2.969-8.24-1.46-2.054 2.053-.03 7.407 4.522 11.959m3.718-10.499a24.16 24.16 0 0 1 3.719 3.062M17.798 11c2.23 3.412 2.898 6.658 1.402 8.153-1.502 1.503-4.771.822-8.2-1.433m1-6.808a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/>
      </svg>
      <span className="font-semibold text-3xl tracking-tight">XXX Vault Test Environment</span>
      
      {account ? (
              <p className="absolute right-0 text-2xl pr-5">{account}</p>
          ) : (
            <div className='absolute right-0 text-2xl pr-5'>
              <Button text={'Connect'} buttonClicked={handleConnectClick} />
            </div>
      )}
      
      </div>
    </nav>
    
    <div className="flex flex-row">
        <div className="basis-1/2 sm:container sm:mx-auto sm:px-20 my-20">
          <div className="box-content h-80 w-auto p-8 border-4">
            <Input
              label={'Asset'}
              token={'SPC'}
              onChange={handleInputChange}
              isEmpty={isAssetEmpty}
            />
            <Input
              label={'Share'}
              token={'vSPC'}
              onChange={handleInputChange}
              isEmpty={isShareEmpty}
            />
            <div className="flex flex-row px-7 pt-3 pl-20 items-center">
              <Button text={'Mint Collection'} buttonClicked={handleDepositClick} />
              <Button text={'Mint NFT'} buttonClicked={handleWithdrawClick} />
            </div>
          </div>
        </div>
        <div className="basis-1/2 sm:container sm:mx-auto sm:px-20 my-20">
          <div className="box-content h-80 w-auto p-8 border-4">
            <p>Your Account: </p><br></br>
            <p>Wallet Address: {account}</p>
            <p>ETH Balance: {balance}</p>
            <p>SPC Token: {token}</p>
            <p>vSPC Token: {lpToken}</p>
            <br></br>
            <p>XXX Vault: </p>
            <p>Vault Name: {vaultName}</p>
            <p>Vault Symbol: {vaultSymbol}</p>
            <p>Total Assets: {totalAssets}</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
