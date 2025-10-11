//SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTStorage is ERC721URIStorage, Ownable {
     uint256 public immutable i_totalSupply;
     uint256 public tokenId;

     event NFTMinted(address indexed to, uint256 indexed tokenId, string tokenURI);

     constructor(uint256 _totalSupply, string memory _name, string memory _symbol) ERC721(_name, _symbol) Ownable(msg.sender) {
        i_totalSupply = _totalSupply;
     }

     function mint(address _to, string memory _tokenURI) public returns (uint256) {
        require(tokenId < i_totalSupply, "Max supply reached");
        require(_to != address(0), "Cannot mint to zero address");

        uint256 newTokenId = tokenId;
        _safeMint(_to, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);

        emit NFTMinted(_to, newTokenId, _tokenURI);

        tokenId++;
        return newTokenId;
     }

     function getTotalMinted() public view returns (uint256) {
        return tokenId;
     }
}