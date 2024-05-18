const { ethers } = require("hardhat")
const fs = require("fs")

async function main() {
  const name = "ExclusiveContentNFT"
  const symbol = "ECNFT"
  const baseTokenURI = "https://example.com/metadata/"
  const vrfCoordinator = "0xYourVRFCoordinatorAddress" // Replace with the actual VRF Coordinator address
  const linkToken = "0xYourLinkTokenAddress" // Replace with the actual LINK token address
  const keyHash = "0xYourKeyHash" // Replace with the actual key hash
  const fee = ethers.parseUnits("0.1", 18) // 0.1 LINK fee

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
  await exclusiveContentNFT.deploymentTransaction().wait()
  const address = await exclusiveContentNFT.getAddress()
  console.log("ExclusiveContentNFT deployed to:", address)

  // Save the contract address to a file
  fs.writeFileSync("exclusiveContentNFT.txt", address)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
