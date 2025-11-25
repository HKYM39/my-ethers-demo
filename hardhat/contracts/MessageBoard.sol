// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

contract MessageStore {
  event MessageStored(
    address indexed sender,
    string message,
    uint256 timestamp
  );

  function storeMessage(string calldata message) external {
    emit MessageStored(msg.sender, message, block.timestamp);
  }
}
