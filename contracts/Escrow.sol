// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract Escrow {
    struct EscrowData {
        address buyer;
        address seller;
        uint256 amount;
        bool released;
        bool refunded;
        uint256 createdAt;
        uint256 opportunityId;
    }

    mapping(uint256 => EscrowData) public escrows;
    uint256 public nextEscrowId = 1;
    
    address public owner;
    uint256 public platformFee = 250; // 2.5% (250 basis points)
    uint256 public constant BASIS_POINTS = 10000;
    
    event EscrowCreated(
        uint256 indexed escrowId,
        uint256 indexed opportunityId,
        address indexed buyer,
        address seller,
        uint256 amount
    );
    
    event FundsReleased(uint256 indexed escrowId, address indexed seller, uint256 amount);
    event FundsRefunded(uint256 indexed escrowId, address indexed buyer, uint256 amount);
    event PlatformFeeUpdated(uint256 newFee);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    
    modifier validEscrow(uint256 escrowId) {
        require(escrowId > 0 && escrowId < nextEscrowId, "Invalid escrow ID");
        require(!escrows[escrowId].released && !escrows[escrowId].refunded, "Escrow already processed");
        _;
    }
    
    constructor() {
        owner = msg.sender;
    }
    
    function createEscrow(
        uint256 opportunityId,
        address seller
    ) external payable returns (uint256) {
        require(msg.value > 0, "Amount must be greater than 0");
        require(seller != address(0), "Invalid seller address");
        require(seller != msg.sender, "Buyer and seller cannot be the same");
        
        uint256 escrowId = nextEscrowId++;
        
        escrows[escrowId] = EscrowData({
            buyer: msg.sender,
            seller: seller,
            amount: msg.value,
            released: false,
            refunded: false,
            createdAt: block.timestamp,
            opportunityId: opportunityId
        });
        
        emit EscrowCreated(escrowId, opportunityId, msg.sender, seller, msg.value);
        
        return escrowId;
    }
    
    function releaseFunds(uint256 escrowId) external validEscrow(escrowId) {
        EscrowData storage escrow = escrows[escrowId];
        
        // Only buyer or seller can release funds
        require(
            msg.sender == escrow.buyer || msg.sender == escrow.seller,
            "Only buyer or seller can release funds"
        );
        
        escrow.released = true;
        
        // Calculate platform fee
        uint256 fee = (escrow.amount * platformFee) / BASIS_POINTS;
        uint256 sellerAmount = escrow.amount - fee;
        
        // Transfer funds to seller
        payable(escrow.seller).transfer(sellerAmount);
        
        // Transfer platform fee to owner
        if (fee > 0) {
            payable(owner).transfer(fee);
        }
        
        emit FundsReleased(escrowId, escrow.seller, sellerAmount);
    }
    
    function refundBuyer(uint256 escrowId) external validEscrow(escrowId) {
        EscrowData storage escrow = escrows[escrowId];
        
        // Only buyer or seller can refund
        require(
            msg.sender == escrow.buyer || msg.sender == escrow.seller,
            "Only buyer or seller can refund"
        );
        
        escrow.refunded = true;
        
        // Refund full amount to buyer
        payable(escrow.buyer).transfer(escrow.amount);
        
        emit FundsRefunded(escrowId, escrow.buyer, escrow.amount);
    }
    
    function getEscrow(uint256 escrowId) external view returns (
        address buyer,
        address seller,
        uint256 amount,
        bool released,
        bool refunded,
        uint256 createdAt,
        uint256 opportunityId
    ) {
        require(escrowId > 0 && escrowId < nextEscrowId, "Invalid escrow ID");
        
        EscrowData memory escrow = escrows[escrowId];
        return (
            escrow.buyer,
            escrow.seller,
            escrow.amount,
            escrow.released,
            escrow.refunded,
            escrow.createdAt,
            escrow.opportunityId
        );
    }
    
    function setPlatformFee(uint256 newFee) external onlyOwner {
        require(newFee <= 1000, "Platform fee cannot exceed 10%"); // Max 10%
        platformFee = newFee;
        emit PlatformFeeUpdated(newFee);
    }
    
    function withdrawPlatformFees() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");
        payable(owner).transfer(balance);
    }
    
    function getContractBalance() external view returns (uint256) {
        return address(this).balance;
    }
    
    function getEscrowCount() external view returns (uint256) {
        return nextEscrowId - 1;
    }
}

