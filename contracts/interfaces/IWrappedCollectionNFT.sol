// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface IWrappedCollectionNFT {

  function initialize(
    string memory tokenName,
    string memory tokenSymbol
  ) external;

  function name() external view returns (string memory);
  function symbol() external view returns (string memory);
  function balanceOf(address owner) external view returns (uint256);
  function ownerOf(uint256 tokenId) external view returns (address);
  function exists(uint256 tokenId) external view returns (bool);
  function getDescription() external view returns (string memory);
  function getCollectionPrice() external view returns (uint256);
  function getMintPrice() external view returns (uint256);
  function getCollectionSize() external view returns (uint32);

  function mint(address to, uint256 tokenId) external;
  function burn(uint256 tokenId) external;
}