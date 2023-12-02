import React from 'react';
import { useEffect, useState } from 'react';
import Web3 from 'web3';
import SpaceCredit from './utils/SpaceCredit.json';
import TokenVault from './utils/TokenVault.json';
import WrappedNFTOwner from './utils/WrappedNFTOwner.json';
import WrappedCollectionNFT from './utils/WrappedCollectionNFT.json';
import BasicToken from './utils/BasicToken.json';
import BasicFactory from './utils/BasicFactory.json';
import WrappedCollectionNFTProxy from './utils/WrappedCollectionNFTProxy.json';


import Button from './components/Button';
import Input from './components/Input';
import './App.css';

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

  // Create a new Web3 instance
  const web3 = new Web3(new Web3.providers.HttpProvider('https://eth-sepolia.g.alchemy.com/v2/Z66PxY86kCkFslToB82DiSM531OnIyHS'));
  const _web3 = new Web3(window.ethereum);
  const accountAddress = "0xb2530c5d8496677353166cb4E705093bD800251D";
  // const spcAddress = "0xD30DFf3480195FEe2D6ae3E6566Ebf06a57aAf35";
  // const vaultAddress = "0x2658042b7ffCDDD4337c16Cd0a6F15E234Ee0f79";
  const nftOwnerAddress = '0x9349dEAA573050D2620c0765bE8F60618EB33dD4'; // Polygon mumbai testnet
  const collectionNFTAddress = '0x9E3396517d3ED080Db158aCEe3f1D2179ec0E7be';
  const basicFactoryAddress = '0x9721F199bb40129b0Bbcf996363B850cCd160520';// sepolia
  const basicTokenAddress = '0xCb24cbfa3a9194Ae5dE4c4516DF5623D9b6F27ae'; // sepolia
  const wrappedNFTProxyAddress = '0x7EF2d37DBEac4351e879da4c2722347f20552b50'; //sepolia

  // // Create an instance of the ERC20 contract
  // const assetToken: any = new _web3.eth.Contract(SpaceCredit, spcAddress);
  // const shareToken: any = new _web3.eth.Contract(TokenVault, vaultAddress);
  // const nftOwner: any = new _web3.eth.Contract(WrappedNFTOwner, nftOwnerAddress);
  // const collectionNFT: any = new _web3.eth.Contract(WrappedCollectionNFT, collectionNFTAddress);
  const basicFactory: any =  new _web3.eth.Contract(BasicFactory, basicFactoryAddress);
  const basicToken: any =  new _web3.eth.Contract(BasicToken, basicTokenAddress);
  const wrappedNFTProxy: any = new _web3.eth.Contract(WrappedCollectionNFTProxy, wrappedNFTProxyAddress);

  loadVaultData();

  useEffect(() => {
    if (window.ethereum) {
      if (window.ethereum._state.isUnlocked) {
        setIsConnected(true);
        connectMetaMask();
      } else {
        setIsConnected(false);
      }
    } else {
      window.alert('Please install MetaMask');
      window.open('https://metamask.io/download.html', '_self');
    }
  }, [isConnected]);

  async function connectMetaMask(): Promise<void> {
    await window.ethereum.request({ method: 'eth_requestAccounts' });

    const walletAccount: any = await _web3.eth.getAccounts();
    console.log("Wallet address: ",walletAccount[0]);
    
    // Get balance of ETH
    const balanceWei: any = await _web3.eth.getBalance(walletAccount[0]);
    const balanceEth: any = _web3.utils.fromWei(balanceWei, 'ether');
    
    // // Get balance of SPC token
    // let SpaceCreditTokenWei = await assetToken.methods.balanceOf(walletAccount[0]).call();
    // let SpaceCreditTokenEth: string = _web3.utils.fromWei(SpaceCreditTokenWei, 'ether');
    
    // // Get balance of vSPC token
    // let vSPCWei = await shareToken.methods.balanceOf(walletAccount[0]).call();
    // let vSPCEth = _web3.utils.fromWei(vSPCWei, 'ether');

    setAccount(walletAccount[0]);
    setBalance(balanceEth);
    // setToken(SpaceCreditTokenEth);
    // setLPToken(vSPCEth);
  }

  async function loadVaultData() {
    try{
      // let vaultName = await shareToken.methods.getVaultName().call();
      // let vaultSymbol = await shareToken.methods.getVaultSymbol().call();
      // let totalAssets = await shareToken.methods.totalAssets().call();
      
      // setVaultName(vaultName);
      // setVaultSymbol(vaultSymbol);
      // setTotalAssets(totalAssets);
    } catch(error: any){
      console.log(error);
    }
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
      await depositTokens(inputs.Asset);
    }
  };

  async function depositTokens(amount: string): Promise<void> {
    try {
      const amountWei = _web3.utils.toWei(amount, 'Gwei');

      console.log("-----------------okay ----------------------");

      // await basicFactory.methods.createNewToken("Second Token", "STC").send({ from: accountAddress });

      await wrappedNFTProxy.methods.createNewCollection("Dog NFT", "DNFT").send({ from: accountAddress });

      // await nftOwner.methods.mintCollection("My NFT", "MNFT", '100').send({ from: accountAddress }); // collection token id

      // await nftOwner.methods.mintNFTForCollection('0x504d4c2B369024fD5cD8973EDd151e3d655A3eB7', accountAddress, '1').send({ from: accountAddress }); // collection address, ntf token id

      // await assetToken.methods.approve(vaultAddress, amountWei).send({ from: accountAddress });
      // await shareToken.methods._deposit(amountWei).send({ from: accountAddress });
    } catch(error: any){
      console.log(error);
    }
  }
  
  const handleWithdrawClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (inputs.Share === '') {
      setIsShareEmpty(true);
    } else {
      setIsShareEmpty(false);
      event.preventDefault();
      await withdrawTokens(inputs.Share, accountAddress);
    }
  };

  async function withdrawTokens(shares: string, receiver: any){
    try{
      // const amountWei = _web3.utils.toWei(shares, 'Gwei');
      // console.log("amount : ", amountWei);
      console.log("receiver : ", receiver);
      
      // const receiver_ = await window.ethereum.request({
      //   method:"eth_requestAccounts",
      // });

      // const shares_ = 3000000000;
      // const receiver_ = accountAddress;
      
      // await nftOwner.methods.mintCollectionAndNFT('Second Collection', 'SecondNFT', accountAddress, '91', '1').send({ from: accountAddress }); // collection id 91, ntf token id 1

      //await shareToken.methods.approve(accountAddress, amountWei).send({ from: accountAddress });
      // await shareToken.methods.approve(vaultAddress, amountWei).send({ from: accountAddress });
      // await shareToken.methods._withdraw(amountWei, vaultAddress).send({from : accountAddress});
      
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
