// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

contract PriceOracle is Ownable {
    uint256 public latestPrice;
    uint256 public lastUpdated;
    string public dataSource;  // e.g., "CoinGecko BTC/USD"

    event PriceUpdated(uint256 newPrice, uint256 timestamp);

    constructor(string memory _dataSource) Ownable(msg.sender) {
        dataSource = _dataSource;
    }

    function updatePrice(uint256 _newPrice) external onlyOwner {
        latestPrice = _newPrice;
        lastUpdated = block.timestamp;
        emit PriceUpdated(_newPrice, block.timestamp);
    }

    function getLatestPrice() external view returns (uint256) {
        return latestPrice;
    }
}