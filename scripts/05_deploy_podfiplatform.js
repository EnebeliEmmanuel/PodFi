// scripts/deploy.js
const { ethers } = require("hardhat")
const fs = require("fs")
async function main() {
  // Addresses for the ERC20 and ERC721 contracts
  const nativeTokenAddress = fs.readFileSync("nativeTokenAddress.txt", "utf8").trim()
  const exclusiveContentAddress = fs.readFileSync("exclusiveContentNFT.txt", "utf8").trim() // Replace with your ERC721 token address

  // Parameters for staking
  const stakingDuration = 30 * 24 * 60 * 60 // 30 days
  const rewardAmount = ethers.parseUnits("1000", 18) // 1000 tokens as reward

  // Get the contract factory
  const PodFiPlatform = await ethers.getContractFactory("PodFiPlatform")

  // Deploy the contract
  console.log("Deploying PodFiPlatform...")
  const podFiPlatform = await PodFiPlatform.deploy(
    nativeTokenAddress,
    exclusiveContentAddress,
    stakingDuration,
    rewardAmount
  )

  // Wait for the deployment to complete
  await podFiPlatform.deployed()

  console.log("PodFiPlatform deployed to:", podFiPlatform.address)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
