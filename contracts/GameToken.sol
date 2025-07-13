// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract GameToken is ERC20, Ownable, ReentrancyGuard {
    uint256 public tokenPrice = 0.001 ether; // 0.001 ETH per token
    uint256 public maxSupply = 1000000 * 10**18; // 1 million tokens
    
    mapping(address => uint256) public userBalance;
    mapping(address => uint256) public totalWins;
    mapping(address => uint256) public totalGames;
    
    event TokensPurchased(address indexed buyer, uint256 amount, uint256 cost);
    event GamePlayed(address indexed player, bool won, uint256 betAmount, uint256 winAmount);
    
    constructor() ERC20("Gynger Game Token", "GYNGER") {
        _mint(msg.sender, 100000 * 10**18); // Initial supply
    }
    
    function purchaseTokens() external payable nonReentrant {
        require(msg.value > 0, "Must send ETH to purchase tokens");
        require(msg.value >= tokenPrice, "Insufficient ETH for minimum purchase");
        
        uint256 tokensToMint = (msg.value * 10**18) / tokenPrice;
        require(totalSupply() + tokensToMint <= maxSupply, "Exceeds max supply");
        
        _mint(msg.sender, tokensToMint);
        userBalance[msg.sender] += tokensToMint;
        
        emit TokensPurchased(msg.sender, tokensToMint, msg.value);
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
        
        emit GamePlayed(msg.sender, won, betAmount, won ? betAmount * 2 : 0);
    }
    
    function withdrawETH() external onlyOwner {
        payable(owner()).transfer(address(this).balance);
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