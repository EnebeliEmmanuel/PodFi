// scripts/deploy.js
const { ethers } = require("hardhat")

async function main() {
  const name = "ExclusiveContentNFT" // Replace with your token name
  const symbol = "ECNFT" // Replace with your token symbol
  const baseTokenURI = "https://example.com/metadata/" // Replace with your base URI

  const vrfCoordinator = "0xYourVrfCoordinatorAddress" // Replace with your VRF Coordinator address
  const linkToken = "0xYourLinkTokenAddress" // Replace with your LINK token address
  const keyHash = "0xYourKeyHash" // Replace with your key hash
  const fee = ethers.utils.parseEther("0.1") // Replace with your fee

  // Get the contract factory
  const ExclusiveContentNFT = await ethers.getContractFactory("ExclusiveContentNFT")

  // Deploy the contract
  console.log("Deploying ExclusiveContentNFT...")
  const exclusiveContentNFT = await ExclusiveContentNFT.deploy(
    name,
    symbol,
    baseTokenURI,
    vrfCoordinator,
    linkToken,
    keyHash,
    fee
  )

  // Wait for the deployment to complete
  await exclusiveContentNFT.deployed()

  console.log("ExclusiveContentNFT deployed to:", exclusiveContentNFT.address)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
