// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract GameToken is ERC20, Ownable, ReentrancyGuard {
    uint256 public tokenPrice = 0.0001 ether; // 0.0001 ETH per token (0.1 ETH = 1,000 tokens)
    uint256 public maxSupply = 1000000 * 10**18; // 1 million tokens
    
    mapping(address => uint256) public userBalance;
    mapping(address => uint256) public totalWins;
    mapping(address => uint256) public totalGames;
    
    event TokensPurchased(address indexed buyer, uint256 amount, uint256 cost, uint256 timestamp);
    event GamePlayed(address indexed player, bool won, uint256 betAmount, uint256 winAmount, bool playerChoice, bool coinResult, uint256 timestamp);
    event ETHWithdrawn(address indexed owner, uint256 amount, uint256 timestamp);
    
    constructor() ERC20("Gynger Game Token", "GYNGER") {
        _mint(msg.sender, 100000 * 10**18); // Initial supply
    }
    
    function purchaseTokens() external payable nonReentrant {
        require(msg.value > 0, "Must send ETH to purchase tokens");
        require(msg.value >= tokenPrice, "Insufficient ETH for minimum purchase");
        
        uint256 tokensToMint = (msg.value * 10**18) / tokenPrice;
        require(tokensToMint <= 10000 * 10**18, "Cannot purchase more than 10,000 tokens per transaction");
        require(totalSupply() + tokensToMint <= maxSupply, "Exceeds max supply");
        
        _mint(msg.sender, tokensToMint);
        userBalance[msg.sender] += tokensToMint;
        
        emit TokensPurchased(msg.sender, tokensToMint, msg.value, block.timestamp);
    }
    
    function playGame(uint256 betAmount, bool playerChoice) external nonReentrant {
        require(betAmount > 0, "Bet amount must be greater than 0");
        require(balanceOf(msg.sender) >= betAmount, "Insufficient tokens");
        
        // Simple random number generation (for demo - use Chainlink VRF in production)
        uint256 randomNumber = uint256(keccak256(abi.encodePacked(
            block.timestamp,
            block.difficulty,
            msg.sender
        ))) % 2;
        
        bool coinResult = randomNumber == 1;
        bool won = playerChoice == coinResult;
        
        if (won) {
            uint256 winAmount = betAmount * 2;
            _mint(msg.sender, winAmount);
            userBalance[msg.sender] += winAmount;
        } else {
            _burn(msg.sender, betAmount);
            userBalance[msg.sender] -= betAmount;
        }
        
        totalWins[msg.sender] += won ? 1 : 0;
        totalGames[msg.sender] += 1;
        
        emit GamePlayed(msg.sender, won, betAmount, won ? betAmount * 2 : 0, playerChoice, coinResult, block.timestamp);
    }
    
    function withdrawETH() external onlyOwner {
        uint256 amount = address(this).balance;
        payable(owner()).transfer(amount);
        emit ETHWithdrawn(owner(), amount, block.timestamp);
    }
    
    function setTokenPrice(uint256 newPrice) external onlyOwner {
        tokenPrice = newPrice;
    }
    
    function getUserStats(address user) external view returns (
        uint256 balance,
        uint256 wins,
        uint256 games,
        uint256 winRate
    ) {
        balance = userBalance[user];
        wins = totalWins[user];
        games = totalGames[user];
        winRate = games > 0 ? (wins * 100) / games : 0;
    }
} 