// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@chainlink/contracts/src/v0.8/vrf/VRFConsumerBase.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract ExclusiveContentNFT is ERC721Enumerable, Ownable, VRFConsumerBase {
  using Strings for uint256;

  // Base URI for metadata
  string private _baseTokenURI;

  // Chainlink VRF variables
  bytes32 internal keyHash;
  uint256 internal fee;

  // Mapping from tokenId to podcast content URI
  mapping(uint256 => string) public tokenContentURIs;

  // Event emitted when a new NFT is minted
  event Minted(address indexed owner, uint256 tokenId, string contentURI);

  // Constructor
  constructor(
    string memory name,
    string memory symbol,
    string memory baseTokenURI,
    address vrfCoordinator,
    address link,
    bytes32 _keyHash,
    uint256 _fee
  ) ERC721(name, symbol) VRFConsumerBase(vrfCoordinator, link) Ownable(msg.sender) {
    _baseTokenURI = baseTokenURI;
    keyHash = _keyHash;
    fee = _fee;
  }

  // Mint new exclusive content NFT
  function mintNFT() external returns (bytes32) {
    require(LINK.balanceOf(address(this)) >= fee, "Not enough LINK to pay fee");
    return requestRandomness(keyHash, fee);
  }

  // Set base URI for metadata
  function setBaseURI(string memory baseTokenURI) external onlyOwner {
    _baseTokenURI = baseTokenURI;
  }

  // Set token URI for a specific token ID
  function setTokenURI(uint256 tokenId, string memory tokenURI) external onlyOwner {
    // require(_exists(tokenId), "Token does not exist");
    tokenContentURIs[tokenId] = tokenURI;
  }

  // Override function to return the URI for a token ID
  function tokenURI(uint256 tokenId) public view override returns (string memory) {
    // require(_exists(tokenId), "Token does not exist");
    string memory _tokenURI = tokenContentURIs[tokenId];
    return
      bytes(_tokenURI).length > 0 ? _tokenURI : string(abi.encodePacked(_baseTokenURI, tokenId.toString(), ".json"));
  }

  // Callback function called by Chainlink VRF with the random result
  function fulfillRandomness(bytes32 requestId, uint256 randomness) internal override {
    uint256 tokenId = uint256(requestId);
    string memory contentURI = generateContentURI(randomness);
    tokenContentURIs[tokenId] = contentURI;
    _safeMint(tx.origin, tokenId); // tx.origin to ensure the correct recipient

    emit Minted(tx.origin, tokenId, contentURI);
  }

  // Function to generate a content URI based on randomness
  function generateContentURI(uint256 randomness) internal pure returns (string memory) {
    return string(abi.encodePacked("https://example.com/content/", randomness.toString()));
  }
}
