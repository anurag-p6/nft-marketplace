//SPDX-Licence-Identifier: MIT 
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTStorage is ERC721URIStorage, Ownable {
     uint256 public immutable i_totalSupply;
     uint256 public tokenId;
      
     constructor(uint8 _totalSupply, string memory _name, string memory _symbol) ERC721(_name, _symbol) Ownable(msg.sender) {
        i_totalSupply = _totalSupply;
        tokenId++;
     }

     function mint(address _to, string memory _tokenURI) public returns (uint256) {
      
        _safeMint(_to, tokenId);
        _setTokenURI(tokenId, _tokenURI);
        tokenId++;

        return tokenId;
     }
}