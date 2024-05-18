// scripts/deploy.js
const { ethers } = require("hardhat")

async function main() {
  // Addresses for the ERC20 and ERC721 contracts
  const podTokenAddress = "0xYourPodTokenAddress" // Replace with your ERC20 token address
  const exclusiveContentAddress = "0xYourExclusiveContentAddress" // Replace with your ERC721 token address

  // Parameters for staking
  const stakingDuration = 30 * 24 * 60 * 60 // 30 days
  const rewardAmount = ethers.utils.parseEther("1000") // 1000 tokens as reward

  // Get the contract factory
  const PodFiPlatform = await ethers.getContractFactory("PodFiPlatform")

  // Deploy the contract
  console.log("Deploying PodFiPlatform...")
  const podFiPlatform = await PodFiPlatform.deploy(
    podTokenAddress,
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
