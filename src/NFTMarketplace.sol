//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

contract NFTMarketplace is ReentrancyGuard, ERC721Holder {
    struct Listing {
        address seller;
        address nftContract;
        uint256 tokenId;
        uint256 price;
        bool active;
    }

    struct Offer {
        address offerer;
        uint256 price;
        uint256 expiresAt;
    }

    // Marketplace fee percentage (2.5% = 250 basis points)
    uint256 public platformFee = 250;
    uint256 public constant FEE_DENOMINATOR = 10000;
    address public feeRecipient;

    // listingId => Listing
    mapping(uint256 => Listing) public listings;
    uint256 public listingCounter;

    // nftContract => tokenId => listingId
    mapping(address => mapping(uint256 => uint256)) public tokenListings;

    // listingId => offerer => Offer
    mapping(uint256 => mapping(address => Offer)) public offers;

    event Listed(
        uint256 indexed listingId,
        address indexed seller,
        address indexed nftContract,
        uint256 tokenId,
        uint256 price
    );

    event Sale(
        uint256 indexed listingId,
        address indexed buyer,
        address indexed seller,
        uint256 price
    );

    event ListingCancelled(uint256 indexed listingId);

    event ListingUpdated(uint256 indexed listingId, uint256 newPrice);

    event OfferMade(
        uint256 indexed listingId,
        address indexed offerer,
        uint256 price,
        uint256 expiresAt
    );

    event OfferAccepted(
        uint256 indexed listingId,
        address indexed offerer,
        uint256 price
    );

    event OfferCancelled(uint256 indexed listingId, address indexed offerer);

    event PlatformFeeUpdated(uint256 newFee);

    event FeeRecipientUpdated(address indexed newRecipient);

    constructor(address _feeRecipient) {
        require(_feeRecipient != address(0), "Invalid fee recipient");
        feeRecipient = _feeRecipient;
    }

    function listNFT(
        address _nftContract,
        uint256 _tokenId,
        uint256 _price
    ) external nonReentrant returns (uint256) {
        require(_price > 0, "Price must be greater than 0");
        require(
            IERC721(_nftContract).ownerOf(_tokenId) == msg.sender,
            "Not the owner"
        );
        require(
            tokenListings[_nftContract][_tokenId] == 0,
            "Already listed"
        );

        // Transfer NFT to marketplace
        IERC721(_nftContract).safeTransferFrom(
            msg.sender,
            address(this),
            _tokenId
        );

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
        require(msg.sender != listing.seller, "Cannot buy your own NFT");

        listing.active = false;
        tokenListings[listing.nftContract][listing.tokenId] = 0;

        // Calculate fees
        uint256 fee = (listing.price * platformFee) / FEE_DENOMINATOR;
        uint256 sellerProceeds = listing.price - fee;

        // Transfer NFT to buyer
        IERC721(listing.nftContract).safeTransferFrom(
            address(this),
            msg.sender,
            listing.tokenId
        );

        // Transfer funds
        (bool feeSuccess, ) = feeRecipient.call{value: fee}("");
        require(feeSuccess, "Fee transfer failed");

        (bool sellerSuccess, ) = listing.seller.call{value: sellerProceeds}("");
        require(sellerSuccess, "Seller transfer failed");

        emit Sale(_listingId, msg.sender, listing.seller, listing.price);
    }

    function cancelListing(uint256 _listingId) external nonReentrant {
        Listing storage listing = listings[_listingId];

        require(listing.active, "Listing not active");
        require(msg.sender == listing.seller, "Not the seller");

        listing.active = false;
        tokenListings[listing.nftContract][listing.tokenId] = 0;

        // Return NFT to seller
        IERC721(listing.nftContract).safeTransferFrom(
            address(this),
            listing.seller,
            listing.tokenId
        );

        emit ListingCancelled(_listingId);
    }

    function updateListingPrice(uint256 _listingId, uint256 _newPrice)
        external
    {
        Listing storage listing = listings[_listingId];

        require(listing.active, "Listing not active");
        require(msg.sender == listing.seller, "Not the seller");
        require(_newPrice > 0, "Price must be greater than 0");

        listing.price = _newPrice;

        emit ListingUpdated(_listingId, _newPrice);
    }

    function makeOffer(uint256 _listingId, uint256 _expiresAt)
        external
        payable
        nonReentrant
    {
        Listing storage listing = listings[_listingId];

        require(listing.active, "Listing not active");
        require(msg.value > 0, "Offer must be greater than 0");
        require(msg.sender != listing.seller, "Cannot offer on your own NFT");
        require(_expiresAt > block.timestamp, "Invalid expiration");

        // Refund previous offer if exists
        Offer storage existingOffer = offers[_listingId][msg.sender];
        if (existingOffer.price > 0) {
            (bool refundSuccess, ) = msg.sender.call{value: existingOffer.price}("");
            require(refundSuccess, "Refund failed");
        }

        offers[_listingId][msg.sender] = Offer({
            offerer: msg.sender,
            price: msg.value,
            expiresAt: _expiresAt
        });

        emit OfferMade(_listingId, msg.sender, msg.value, _expiresAt);
    }

    function acceptOffer(uint256 _listingId, address _offerer)
        external
        nonReentrant
    {
        Listing storage listing = listings[_listingId];
        Offer storage offer = offers[_listingId][_offerer];

        require(listing.active, "Listing not active");
        require(msg.sender == listing.seller, "Not the seller");
        require(offer.price > 0, "Offer does not exist");
        require(block.timestamp <= offer.expiresAt, "Offer expired");

        listing.active = false;
        tokenListings[listing.nftContract][listing.tokenId] = 0;

        uint256 offerPrice = offer.price;
        delete offers[_listingId][_offerer];

        // Calculate fees
        uint256 fee = (offerPrice * platformFee) / FEE_DENOMINATOR;
        uint256 sellerProceeds = offerPrice - fee;

        // Transfer NFT to buyer
        IERC721(listing.nftContract).safeTransferFrom(
            address(this),
            _offerer,
            listing.tokenId
        );

        // Transfer funds
        (bool feeSuccess, ) = feeRecipient.call{value: fee}("");
        require(feeSuccess, "Fee transfer failed");

        (bool sellerSuccess, ) = listing.seller.call{value: sellerProceeds}("");
        require(sellerSuccess, "Seller transfer failed");

        emit OfferAccepted(_listingId, _offerer, offerPrice);
    }

    function cancelOffer(uint256 _listingId) external nonReentrant {
        Offer storage offer = offers[_listingId][msg.sender];

        require(offer.price > 0, "No offer to cancel");

        uint256 refundAmount = offer.price;
        delete offers[_listingId][msg.sender];

        (bool success, ) = msg.sender.call{value: refundAmount}("");
        require(success, "Refund failed");

        emit OfferCancelled(_listingId, msg.sender);
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

    function getListing(uint256 _listingId)
        external
        view
        returns (
            address seller,
            address nftContract,
            uint256 tokenId,
            uint256 price,
            bool active
        )
    {
        Listing storage listing = listings[_listingId];
        return (
            listing.seller,
            listing.nftContract,
            listing.tokenId,
            listing.price,
            listing.active
        );
    }

    function getOffer(uint256 _listingId, address _offerer)
        external
        view
        returns (
            address offerer,
            uint256 price,
            uint256 expiresAt
        )
    {
        Offer storage offer = offers[_listingId][_offerer];
        return (offer.offerer, offer.price, offer.expiresAt);
    }
}