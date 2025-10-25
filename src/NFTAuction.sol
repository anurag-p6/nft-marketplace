// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTAuction is ReentrancyGuard, ERC721Holder, Ownable {
    struct Auction {
        address seller;
        address nftContract;
        uint256 tokenId;
        uint256 startPrice;
        uint256 highestBid;
        address highestBidder;
        uint256 startTime;
        uint256 endTime;
        bool active;
        bool settled;
    }

    // Platform fee percentage (2.5% = 250 basis points)
    uint256 public platformFee = 250;
    uint256 public constant FEE_DENOMINATOR = 10000;
    
    // auctionId => Auction
    mapping(uint256 => Auction) public auctions;
    uint256 public auctionCounter;

    // nftContract => tokenId => auctionId
    mapping(address => mapping(uint256 => uint256)) public tokenAuctions;

    // auctionId => bidder => bid amount
    mapping(uint256 => mapping(address => uint256)) public bids;

    event AuctionCreated(
        uint256 indexed auctionId,
        address indexed seller,
        address indexed nftContract,
        uint256 tokenId,
        uint256 startPrice,
        uint256 startTime,
        uint256 endTime
    );

    event BidPlaced(
        uint256 indexed auctionId,
        address indexed bidder,
        uint256 amount
    );

    event AuctionSettled(
        uint256 indexed auctionId,
        address indexed winner,
        uint256 amount
    );

    event AuctionCancelled(uint256 indexed auctionId);
    event BidWithdrawn(uint256 indexed auctionId, address indexed bidder, uint256 amount);
    event PlatformFeeUpdated(uint256 newFee);

    constructor() Ownable(msg.sender) {}

    function createAuction(
        address _nftContract,
        uint256 _tokenId,
        uint256 _startPrice,
        uint256 _duration
    ) external nonReentrant returns (uint256) {
        require(_startPrice > 0, "Start price must be > 0");
        require(_duration >= 1 hours && _duration <= 30 days, "Invalid duration");
        require(IERC721(_nftContract).ownerOf(_tokenId) == msg.sender, "Not owner");
        require(tokenAuctions[_nftContract][_tokenId] == 0, "Already in auction");

        // Transfer NFT to auction contract
        IERC721(_nftContract).safeTransferFrom(msg.sender, address(this), _tokenId);

        auctionCounter++;
        uint256 auctionId = auctionCounter;

        auctions[auctionId] = Auction({
            seller: msg.sender,
            nftContract: _nftContract,
            tokenId: _tokenId,
            startPrice: _startPrice,
            highestBid: 0,
            highestBidder: address(0),
            startTime: block.timestamp,
            endTime: block.timestamp + _duration,
            active: true,
            settled: false
        });

        tokenAuctions[_nftContract][_tokenId] = auctionId;

        emit AuctionCreated(
            auctionId,
            msg.sender,
            _nftContract,
            _tokenId,
            _startPrice,
            block.timestamp,
            block.timestamp + _duration
        );

        return auctionId;
    }

    function placeBid(uint256 _auctionId) external payable nonReentrant {
        Auction storage auction = auctions[_auctionId];
        
        require(auction.active, "Auction not active");
        require(block.timestamp >= auction.startTime, "Auction not started");
        require(block.timestamp < auction.endTime, "Auction ended");
        require(msg.sender != auction.seller, "Seller cannot bid");
        require(msg.value > 0, "Bid must be > 0");

        uint256 totalBid = bids[_auctionId][msg.sender] + msg.value;

        if (auction.highestBid == 0) {
            require(totalBid >= auction.startPrice, "Bid below start price");
        } else {
            require(totalBid > auction.highestBid, "Bid not higher than current");
        }

        // Refund previous highest bidder if they're being outbid
        if (auction.highestBidder != address(0) && auction.highestBidder != msg.sender) {
            bids[_auctionId][auction.highestBidder] = 0;
            _safeTransferETH(auction.highestBidder, auction.highestBid);
        }

        bids[_auctionId][msg.sender] = totalBid;
        auction.highestBid = totalBid;
        auction.highestBidder = msg.sender;

        emit BidPlaced(_auctionId, msg.sender, totalBid);
    }

    function settleAuction(uint256 _auctionId) external nonReentrant {
        Auction storage auction = auctions[_auctionId];

        require(auction.active, "Auction not active");
        require(block.timestamp >= auction.endTime, "Auction not ended");
        require(!auction.settled, "Already settled");

        auction.active = false;
        auction.settled = true;
        tokenAuctions[auction.nftContract][auction.tokenId] = 0;

        if (auction.highestBidder != address(0)) {
            // Calculate fees and proceeds
            uint256 fee = (auction.highestBid * platformFee) / FEE_DENOMINATOR;
            uint256 sellerProceeds = auction.highestBid - fee;

            // Transfer NFT to winner
            IERC721(auction.nftContract).safeTransferFrom(
                address(this),
                auction.highestBidder,
                auction.tokenId
            );

            // Clear winner's bid
            bids[_auctionId][auction.highestBidder] = 0;

            // Transfer funds
            _safeTransferETH(owner(), fee);
            _safeTransferETH(auction.seller, sellerProceeds);

            emit AuctionSettled(_auctionId, auction.highestBidder, auction.highestBid);
        } else {
            // No bids, return NFT to seller
            IERC721(auction.nftContract).safeTransferFrom(
                address(this),
                auction.seller,
                auction.tokenId
            );
            emit AuctionCancelled(_auctionId);
        }
    }

    function cancelAuction(uint256 _auctionId) external nonReentrant {
        Auction storage auction = auctions[_auctionId];

        require(auction.active, "Auction not active");
        require(msg.sender == auction.seller, "Not seller");
        require(auction.highestBidder == address(0), "Bids already placed");

        auction.active = false;
        auction.settled = true;
        tokenAuctions[auction.nftContract][auction.tokenId] = 0;

        IERC721(auction.nftContract).safeTransferFrom(
            address(this),
            auction.seller,
            auction.tokenId
        );

        emit AuctionCancelled(_auctionId);
    }

    function withdrawBid(uint256 _auctionId) external nonReentrant {
        Auction storage auction = auctions[_auctionId];
        uint256 bidAmount = bids[_auctionId][msg.sender];

        require(bidAmount > 0, "No bid to withdraw");
        require(
            msg.sender != auction.highestBidder || 
            !auction.active || 
            auction.settled,
            "Cannot withdraw winning bid"
        );

        bids[_auctionId][msg.sender] = 0;
        _safeTransferETH(msg.sender, bidAmount);

        emit BidWithdrawn(_auctionId, msg.sender, bidAmount);
    }

    function updatePlatformFee(uint256 _newFee) external onlyOwner {
        require(_newFee <= 1000, "Fee too high"); // Max 10%
        platformFee = _newFee;
        emit PlatformFeeUpdated(_newFee);
    }

    // View functions
    function getAuction(uint256 _auctionId) external view returns (
        address seller,
        address nftContract,
        uint256 tokenId,
        uint256 startPrice,
        uint256 highestBid,
        address highestBidder,
        uint256 startTime,
        uint256 endTime,
        bool active,
        bool settled
    ) {
        Auction storage auction = auctions[_auctionId];
        return (
            auction.seller,
            auction.nftContract,
            auction.tokenId,
            auction.startPrice,
            auction.highestBid,
            auction.highestBidder,
            auction.startTime,
            auction.endTime,
            auction.active,
            auction.settled
        );
    }

    function getBid(uint256 _auctionId, address _bidder) external view returns (uint256) {
        return bids[_auctionId][_bidder];
    }

    function getTimeLeft(uint256 _auctionId) external view returns (uint256) {
        Auction storage auction = auctions[_auctionId];
        return block.timestamp >= auction.endTime ? 0 : auction.endTime - block.timestamp;
    }

    // Safe ETH transfer function
    function _safeTransferETH(address to, uint256 value) internal {
        (bool success, ) = to.call{value: value}("");
        require(success, "ETH transfer failed");
    }

    // Emergency functions
    function emergencyWithdrawETH() external onlyOwner {
        _safeTransferETH(owner(), address(this).balance);
    }

    function emergencyWithdrawNFT(address _nftContract, uint256 _tokenId) external onlyOwner {
        IERC721(_nftContract).safeTransferFrom(address(this), owner(), _tokenId);
    }
}