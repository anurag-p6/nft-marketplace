//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

contract NFTAuction is ReentrancyGuard, ERC721Holder {
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
    address public feeRecipient;

    // auctionId => Auction
    mapping(uint256 => Auction) public auctions;
    uint256 public auctionCounter;

    // auctionId => bidder => bid amount
    mapping(uint256 => mapping(address => uint256)) public bids;

    // nftContract => tokenId => auctionId
    mapping(address => mapping(uint256 => uint256)) public tokenAuctions;

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

    event BidWithdrawn(
        uint256 indexed auctionId,
        address indexed bidder,
        uint256 amount
    );

    event PlatformFeeUpdated(uint256 newFee);

    event FeeRecipientUpdated(address indexed newRecipient);

    constructor(address _feeRecipient) {
        require(_feeRecipient != address(0), "Invalid fee recipient");
        feeRecipient = _feeRecipient;
    }

    function createAuction(
        address _nftContract,
        uint256 _tokenId,
        uint256 _startPrice,
        uint256 _duration
    ) external nonReentrant returns (uint256) {
        require(_startPrice > 0, "Start price must be greater than 0");
        require(_duration >= 1 hours, "Duration too short");
        require(_duration <= 30 days, "Duration too long");
        require(
            IERC721(_nftContract).ownerOf(_tokenId) == msg.sender,
            "Not the owner"
        );
        require(
            tokenAuctions[_nftContract][_tokenId] == 0,
            "Already in auction"
        );

        // Transfer NFT to auction contract
        IERC721(_nftContract).safeTransferFrom(
            msg.sender,
            address(this),
            _tokenId
        );

        auctionCounter++;
        uint256 auctionId = auctionCounter;

        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + _duration;

        auctions[auctionId] = Auction({
            seller: msg.sender,
            nftContract: _nftContract,
            tokenId: _tokenId,
            startPrice: _startPrice,
            highestBid: 0,
            highestBidder: address(0),
            startTime: startTime,
            endTime: endTime,
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
            startTime,
            endTime
        );

        return auctionId;
    }

    function placeBid(uint256 _auctionId) external payable nonReentrant {
        Auction storage auction = auctions[_auctionId];

        require(auction.active, "Auction not active");
        require(block.timestamp >= auction.startTime, "Auction not started");
        require(block.timestamp < auction.endTime, "Auction ended");
        require(msg.sender != auction.seller, "Seller cannot bid");
        require(msg.value > 0, "Bid must be greater than 0");

        uint256 totalBid = bids[_auctionId][msg.sender] + msg.value;

        if (auction.highestBid == 0) {
            require(
                totalBid >= auction.startPrice,
                "Bid below start price"
            );
        } else {
            require(
                totalBid > auction.highestBid,
                "Bid not higher than current highest"
            );
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
            // Calculate fees
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
            (bool feeSuccess, ) = feeRecipient.call{value: fee}("");
            require(feeSuccess, "Fee transfer failed");

            (bool sellerSuccess, ) = auction.seller.call{
                value: sellerProceeds
            }("");
            require(sellerSuccess, "Seller transfer failed");

            emit AuctionSettled(
                _auctionId,
                auction.highestBidder,
                auction.highestBid
            );
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
        require(msg.sender == auction.seller, "Not the seller");
        require(auction.highestBidder == address(0), "Bids already placed");

        auction.active = false;
        auction.settled = true;
        tokenAuctions[auction.nftContract][auction.tokenId] = 0;

        // Return NFT to seller
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
            msg.sender != auction.highestBidder || !auction.active || auction.settled,
            "Cannot withdraw winning bid from active auction"
        );

        bids[_auctionId][msg.sender] = 0;

        (bool success, ) = msg.sender.call{value: bidAmount}("");
        require(success, "Withdrawal failed");

        emit BidWithdrawn(_auctionId, msg.sender, bidAmount);
    }

    function updatePlatformFee(uint256 _newFee) external {
        require(msg.sender == feeRecipient, "Only fee recipient");
        require(_newFee <= 1000, "Fee too high"); // Max 10%
        platformFee = _newFee;
        emit PlatformFeeUpdated(_newFee);
    }

    function updateFeeRecipient(address _newRecipient) external {
        require(msg.sender == feeRecipient, "Only fee recipient");
        require(_newRecipient != address(0), "Invalid address");
        feeRecipient = _newRecipient;
        emit FeeRecipientUpdated(_newRecipient);
    }

    function getAuction(uint256 _auctionId)
        external
        view
        returns (
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
        )
    {
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

    function getBid(uint256 _auctionId, address _bidder)
        external
        view
        returns (uint256)
    {
        return bids[_auctionId][_bidder];
    }

    function getTimeLeft(uint256 _auctionId) external view returns (uint256) {
        Auction storage auction = auctions[_auctionId];
        if (block.timestamp >= auction.endTime) {
            return 0;
        }
        return auction.endTime - block.timestamp;
    }
}