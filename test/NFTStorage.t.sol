//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/NFTStorage.sol";

contract NFTStorageTest is Test {
    NFTStorage public nftStorage;
    address public owner = address(1);
    address public user1 = address(2);
    address public user2 = address(3);

    string constant NAME = "Test NFT";
    string constant SYMBOL = "TNFT";
    uint256 constant TOTAL_SUPPLY = 100;

    event NFTMinted(address indexed to, uint256 indexed tokenId, string tokenURI);

    function setUp() public {
        vm.prank(owner);
        nftStorage = new NFTStorage(TOTAL_SUPPLY, NAME, SYMBOL, "https://api.example.com/metadata/");
    }

    function testConstructor() public view {
        assertEq(nftStorage.name(), NAME);
        assertEq(nftStorage.symbol(), SYMBOL);
        assertEq(nftStorage.maxSupply(), TOTAL_SUPPLY);
        assertEq(nftStorage.getTotalMinted(), 0);
        assertEq(nftStorage.owner(), owner);
    }

    function testMint() public {
        vm.prank(owner);
        string memory tokenURI = "ipfs://test-uri-1";

        vm.expectEmit(true, true, false, true);
        emit NFTMinted(user1, 0, tokenURI);

        uint256 tokenId = nftStorage.mint(user1, tokenURI);

        assertEq(tokenId, 1);
        assertEq(nftStorage.ownerOf(tokenId), user1);
        assertEq(nftStorage.tokenURI(tokenId), tokenURI);
        assertEq(nftStorage.getTotalMinted(), 1);
    }

    function testMintMultiple() public {
        vm.startPrank(owner);

        for (uint256 i = 1; i <= 5; i++) {
            string memory tokenURI = string(abi.encodePacked("ipfs://test-uri-", vm.toString(i)));
            uint256 tokenId = nftStorage.mint(user1, tokenURI);

            assertEq(tokenId, i);
            assertEq(nftStorage.ownerOf(tokenId), user1);
            assertEq(nftStorage.tokenURI(tokenId), tokenURI);
        }

        assertEq(nftStorage.getTotalMinted(), 5);

        vm.stopPrank();
    }

    function testMintToZeroAddressReverts() public {
        vm.prank(owner);
        vm.expectRevert("Cannot mint to zero address");
        nftStorage.mint(address(0), "ipfs://test-uri");
    }

    function testMintMaxSupplyReached() public {
        vm.startPrank(owner);

        // Mint up to max supply
        for (uint256 i = 1; i <= TOTAL_SUPPLY; i++) {
            nftStorage.mint(user1, string(abi.encodePacked("ipfs://", vm.toString(i))));
        }

        // Try to mint one more
        vm.expectRevert("Max supply reached");
        nftStorage.mint(user1, "ipfs://overflow");

        vm.stopPrank();
    }

    function testGetTotalMinted() public {
        assertEq(nftStorage.getTotalMinted(), 0);

        vm.startPrank(owner);
        nftStorage.mint(user1, "ipfs://1");
        assertEq(nftStorage.getTotalMinted(), 1);

        nftStorage.mint(user2, "ipfs://2");
        assertEq(nftStorage.getTotalMinted(), 2);

        vm.stopPrank();
    }

    function testOwnership() public {
        assertEq(nftStorage.owner(), owner);

        vm.prank(owner);
        nftStorage.transferOwnership(user1);

        assertEq(nftStorage.owner(), user1);
    }

    function testBalanceOf() public {
        vm.startPrank(owner);

        nftStorage.mint(user1, "ipfs://1");
        nftStorage.mint(user1, "ipfs://2");
        nftStorage.mint(user2, "ipfs://3");

        assertEq(nftStorage.balanceOf(user1), 2);
        assertEq(nftStorage.balanceOf(user2), 1);

        vm.stopPrank();
    }

    function testTransferFrom() public {
        vm.prank(owner);
        uint256 tokenId = nftStorage.mint(user1, "ipfs://test");

        vm.prank(user1);
        nftStorage.transferFrom(user1, user2, tokenId);

        assertEq(nftStorage.ownerOf(tokenId), user2);
        assertEq(nftStorage.balanceOf(user1), 0);
        assertEq(nftStorage.balanceOf(user2), 1);
    }

    function testApproveAndTransferFrom() public {
        vm.prank(owner);
        uint256 tokenId = nftStorage.mint(user1, "ipfs://test");

        vm.prank(user1);
        nftStorage.approve(user2, tokenId);

        assertEq(nftStorage.getApproved(tokenId), user2);

        vm.prank(user2);
        nftStorage.transferFrom(user1, user2, tokenId);

        assertEq(nftStorage.ownerOf(tokenId), user2);
    }

    function testSetApprovalForAll() public {
        vm.prank(owner);
        nftStorage.mint(user1, "ipfs://test");

        vm.prank(user1);
        nftStorage.setApprovalForAll(user2, true);

        assertTrue(nftStorage.isApprovedForAll(user1, user2));
    }

    function testSupportsInterface() public view {
        // ERC721
        assertTrue(nftStorage.supportsInterface(0x80ac58cd));
        // ERC721Metadata
        assertTrue(nftStorage.supportsInterface(0x5b5e139f));
        // ERC165
        assertTrue(nftStorage.supportsInterface(0x01ffc9a7));
    }

    function testFuzzMint(address to, string memory uri) public {
        vm.assume(to != address(0));
        vm.assume(bytes(uri).length > 0);

        vm.prank(owner);
        uint256 tokenId = nftStorage.mint(to, uri);

        assertEq(nftStorage.ownerOf(tokenId), to);
        assertEq(nftStorage.tokenURI(tokenId), uri);
    }
}