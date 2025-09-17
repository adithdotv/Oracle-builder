// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract AdvancedOracle is Ownable, ReentrancyGuard {
    struct PriceData {
        uint256 price;
        uint256 timestamp;
        uint256 confidence; // Confidence level (0-100)
    }

    mapping(string => PriceData) public priceFeeds;
    mapping(string => bool) public activeFeed;
    string[] public feedNames;
    
    uint256 public constant MAX_PRICE_AGE = 1 hours;
    uint256 public updateFee = 0; // Fee in wei for updates
    
    event PriceUpdated(
        string indexed feedName,
        uint256 price,
        uint256 timestamp,
        uint256 confidence
    );
    
    event FeedAdded(string indexed feedName);
    event FeedRemoved(string indexed feedName);
    event UpdateFeeChanged(uint256 newFee);

    constructor() Ownable(msg.sender) {}

    modifier validFeed(string memory feedName) {
        require(activeFeed[feedName], "Feed not active");
        _;
    }

    function addPriceFeed(string memory feedName) external onlyOwner {
        require(!activeFeed[feedName], "Feed already exists");
        
        activeFeed[feedName] = true;
        feedNames.push(feedName);
        
        emit FeedAdded(feedName);
    }

    function removePriceFeed(string memory feedName) external onlyOwner validFeed(feedName) {
        activeFeed[feedName] = false;
        
        // Remove from feedNames array
        for (uint i = 0; i < feedNames.length; i++) {
            if (keccak256(bytes(feedNames[i])) == keccak256(bytes(feedName))) {
                feedNames[i] = feedNames[feedNames.length - 1];
                feedNames.pop();
                break;
            }
        }
        
        emit FeedRemoved(feedName);
    }

    function updatePrice(
        string memory feedName,
        uint256 price,
        uint256 confidence
    ) external payable validFeed(feedName) nonReentrant {
        require(msg.value >= updateFee, "Insufficient fee");
        require(confidence <= 100, "Invalid confidence level");
        require(price > 0, "Price must be positive");

        priceFeeds[feedName] = PriceData({
            price: price,
            timestamp: block.timestamp,
            confidence: confidence
        });

        emit PriceUpdated(feedName, price, block.timestamp, confidence);
    }

    function batchUpdatePrices(
        string[] memory feedNames_,
        uint256[] memory prices,
        uint256[] memory confidences
    ) external payable onlyOwner nonReentrant {
        require(
            feedNames_.length == prices.length && 
            prices.length == confidences.length,
            "Array length mismatch"
        );
        require(msg.value >= updateFee * feedNames_.length, "Insufficient fee");

        for (uint i = 0; i < feedNames_.length; i++) {
            require(activeFeed[feedNames_[i]], "Invalid feed");
            require(confidences[i] <= 100, "Invalid confidence");
            require(prices[i] > 0, "Price must be positive");

            priceFeeds[feedNames_[i]] = PriceData({
                price: prices[i],
                timestamp: block.timestamp,
                confidence: confidences[i]
            });

            emit PriceUpdated(feedNames_[i], prices[i], block.timestamp, confidences[i]);
        }
    }

    function getLatestPrice(string memory feedName) 
        external 
        view 
        validFeed(feedName) 
        returns (uint256 price, uint256 timestamp, uint256 confidence) 
    {
        PriceData memory data = priceFeeds[feedName];
        require(data.timestamp > 0, "No price data available");
        
        return (data.price, data.timestamp, data.confidence);
    }

    function isPriceStale(string memory feedName) external view returns (bool) {
        if (!activeFeed[feedName]) return true;
        
        PriceData memory data = priceFeeds[feedName];
        if (data.timestamp == 0) return true;
        
        return (block.timestamp - data.timestamp) > MAX_PRICE_AGE;
    }

    function getAllActiveFeeds() external view returns (string[] memory) {
        uint256 activeCount = 0;
        
        // Count active feeds
        for (uint i = 0; i < feedNames.length; i++) {
            if (activeFeed[feedNames[i]]) {
                activeCount++;
            }
        }
        
        // Create array of active feeds
        string[] memory activeFeeds = new string[](activeCount);
        uint256 index = 0;
        
        for (uint i = 0; i < feedNames.length; i++) {
            if (activeFeed[feedNames[i]]) {
                activeFeeds[index] = feedNames[i];
                index++;
            }
        }
        
        return activeFeeds;
    }

    function setUpdateFee(uint256 newFee) external onlyOwner {
        updateFee = newFee;
        emit UpdateFeeChanged(newFee);
    }

    function withdrawFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        
        (bool success, ) = payable(owner()).call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    function getFeedCount() external view returns (uint256) {
        return feedNames.length;
    }

    function getFeedInfo(string memory feedName) 
        external 
        view 
        returns (
            bool active,
            uint256 price,
            uint256 timestamp,
            uint256 confidence,
            bool stale
        ) 
    {
        active = activeFeed[feedName];
        if (active) {
            PriceData memory data = priceFeeds[feedName];
            price = data.price;
            timestamp = data.timestamp;
            confidence = data.confidence;
            stale = (block.timestamp - timestamp) > MAX_PRICE_AGE;
        }
    }
}