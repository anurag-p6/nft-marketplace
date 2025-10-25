// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMarketplace is ReentrancyGuard, ERC721Holder, Ownable {
    struct Listing {
        address seller;
        address nftContract;
        uint256 tokenId;
        uint256 price;
        bool active;
    }

    struct Offer {
        uint256 price;
        uint256 expiresAt;
    }

    uint256 public platformFee = 250; // 2.5%
    uint256 public constant FEE_DENOMINATOR = 10000;

    mapping(uint256 => Listing) public listings;
    mapping(address => mapping(uint256 => uint256)) public tokenListings;
    mapping(uint256 => mapping(address => Offer)) public offers;
    
    uint256 public listingCounter;

    event Listed(uint256 indexed listingId, address indexed seller, address indexed nftContract, uint256 tokenId, uint256 price);
    event Sale(uint256 indexed listingId, address indexed buyer, address indexed seller, uint256 price);
    event ListingCancelled(uint256 indexed listingId);
    event ListingUpdated(uint256 indexed listingId, uint256 newPrice);
    event OfferMade(uint256 indexed listingId, address indexed offerer, uint256 price, uint256 expiresAt);
    event OfferAccepted(uint256 indexed listingId, address indexed offerer, uint256 price);
    event OfferCancelled(uint256 indexed listingId, address indexed offerer);
    event PlatformFeeUpdated(uint256 newFee);

    constructor() Ownable(msg.sender) {}

    function listNFT(address _nftContract, uint256 _tokenId, uint256 _price) 
        external 
        nonReentrant 
        returns (uint256) 
    {
        require(_price > 0, "Price must be > 0");
        require(IERC721(_nftContract).ownerOf(_tokenId) == msg.sender, "Not owner");
        require(tokenListings[_nftContract][_tokenId] == 0, "Already listed");

        IERC721(_nftContract).safeTransferFrom(msg.sender, address(this), _tokenId);

        listingCounter++;
        uint256 listingId = listingCounter;

        listings[listingId] = Listing({
            seller: msg.sender,
            nftContract: _nftContract,
            tokenId: _tokenId,
            price: _price,
            active: true
        });

        tokenListings[_nftContract][_tokenId] = listingId;

        emit Listed(listingId, msg.sender, _nftContract, _tokenId, _price);
        return listingId;
    }

    function buyNFT(uint256 _listingId) external payable nonReentrant {
        Listing storage listing = listings[_listingId];

        require(listing.active, "Listing not active");
        require(msg.value == listing.price, "Incorrect price");
        require(msg.sender != listing.seller, "Cannot buy own NFT");

        listing.active = false;
        tokenListings[listing.nftContract][listing.tokenId] = 0;

        uint256 fee = (listing.price * platformFee) / FEE_DENOMINATOR;
        uint256 sellerProceeds = listing.price - fee;

        IERC721(listing.nftContract).safeTransferFrom(address(this), msg.sender, listing.tokenId);

        _safeTransferETH(owner(), fee);
        _safeTransferETH(listing.seller, sellerProceeds);

        emit Sale(_listingId, msg.sender, listing.seller, listing.price);
    }

    function makeOffer(uint256 _listingId, uint256 _duration) external payable nonReentrant {
        Listing storage listing = listings[_listingId];

        require(listing.active, "Listing not active");
        require(msg.value > 0, "Offer must be > 0");
        require(msg.sender != listing.seller, "Cannot offer on own NFT");
        require(_duration <= 30 days, "Duration too long");

        // Refund previous offer if exists
        Offer storage existingOffer = offers[_listingId][msg.sender];
        if (existingOffer.price > 0) {
            _safeTransferETH(msg.sender, existingOffer.price);
        }

        offers[_listingId][msg.sender] = Offer({
            price: msg.value,
            expiresAt: block.timestamp + _duration
        });

        emit OfferMade(_listingId, msg.sender, msg.value, block.timestamp + _duration);
    }

    function acceptOffer(uint256 _listingId, address _offerer) external nonReentrant {
        Listing storage listing = listings[_listingId];
        Offer storage offer = offers[_listingId][_offerer];

        require(listing.active, "Listing not active");
        require(msg.sender == listing.seller, "Not seller");
        require(offer.price > 0, "No offer");
        require(block.timestamp <= offer.expiresAt, "Offer expired");

        listing.active = false;
        tokenListings[listing.nftContract][listing.tokenId] = 0;

        uint256 offerPrice = offer.price;
        delete offers[_listingId][_offerer];

        uint256 fee = (offerPrice * platformFee) / FEE_DENOMINATOR;
        uint256 sellerProceeds = offerPrice - fee;

        IERC721(listing.nftContract).safeTransferFrom(address(this), _offerer, listing.tokenId);

        _safeTransferETH(owner(), fee);
        _safeTransferETH(listing.seller, sellerProceeds);

        emit OfferAccepted(_listingId, _offerer, offerPrice);
    }

    function cancelListing(uint256 _listingId) external nonReentrant {
        Listing storage listing = listings[_listingId];

        require(listing.active, "Listing not active");
        require(msg.sender == listing.seller, "Not seller");

        listing.active = false;
        tokenListings[listing.nftContract][listing.tokenId] = 0;

        IERC721(listing.nftContract).safeTransferFrom(address(this), listing.seller, listing.tokenId);

        emit ListingCancelled(_listingId);
    }

    function cancelOffer(uint256 _listingId) external nonReentrant {
        Offer storage offer = offers[_listingId][msg.sender];
        require(offer.price > 0, "No offer");

        uint256 refundAmount = offer.price;
        delete offers[_listingId][msg.sender];

        _safeTransferETH(msg.sender, refundAmount);
        emit OfferCancelled(_listingId, msg.sender);
    }

    function updatePlatformFee(uint256 _newFee) external onlyOwner {
        require(_newFee <= 1000, "Fee too high");
        platformFee = _newFee;
        emit PlatformFeeUpdated(_newFee);
    }

    // View functions
    function getListing(uint256 _listingId) external view returns (
        address seller,
        address nftContract,
        uint256 tokenId,
        uint256 price,
        bool active
    ) {
        Listing storage listing = listings[_listingId];
        return (listing.seller, listing.nftContract, listing.tokenId, listing.price, listing.active);
    }

    function getOffer(uint256 _listingId, address _offerer) external view returns (
        uint256 price,
        uint256 expiresAt
    ) {
        Offer storage offer = offers[_listingId][_offerer];
        return (offer.price, offer.expiresAt);
    }

    function _safeTransferETH(address to, uint256 value) internal {
        (bool success, ) = to.call{value: value}("");
        require(success, "ETH transfer failed");
    }
}