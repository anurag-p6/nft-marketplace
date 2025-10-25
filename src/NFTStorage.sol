// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTStorage is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    
    Counters.Counter private _tokenIdCounter;
    uint256 public immutable maxSupply;
    string public baseURI;

    event NFTMinted(address indexed to, uint256 indexed tokenId, string tokenURI);

    constructor(
        uint256 _maxSupply, 
        string memory _name, 
        string memory _symbol,
        string memory _baseURI
    ) ERC721(_name, _symbol) Ownable(msg.sender) {
        maxSupply = _maxSupply;
        baseURI = _baseURI;
    }

    function mint(address _to, string memory _tokenURI) external onlyOwner returns (uint256) {
        require(_tokenIdCounter.current() < maxSupply, "Max supply reached");
        require(_to != address(0), "Cannot mint to zero address");

        _tokenIdCounter.increment();
        uint256 newTokenId = _tokenIdCounter.current();

        _safeMint(_to, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);

        emit NFTMinted(_to, newTokenId, _tokenURI);
        return newTokenId;
    }

    function batchMint(address[] calldata _recipients, string[] calldata _tokenURIs) 
        external 
        onlyOwner 
    {
        require(_recipients.length == _tokenURIs.length, "Arrays length mismatch");
        require(_tokenIdCounter.current() + _recipients.length <= maxSupply, "Exceeds max supply");

        for (uint256 i = 0; i < _recipients.length; i++) {
            _tokenIdCounter.increment();
            uint256 newTokenId = _tokenIdCounter.current();

            _safeMint(_recipients[i], newTokenId);
            _setTokenURI(newTokenId, _tokenURIs[i]);

            emit NFTMinted(_recipients[i], newTokenId, _tokenURIs[i]);
        }
    }

    function setBaseURI(string memory _newBaseURI) external onlyOwner {
        baseURI = _newBaseURI;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter.current();
    }

    function getTotalMinted() external view returns (uint256) {
        return _tokenIdCounter.current();
    }

    function exists(uint256 tokenId) external view returns (bool) {
        return _exists(tokenId);
    }
}