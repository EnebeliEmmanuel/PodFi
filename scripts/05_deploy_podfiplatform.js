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
  await podFiPlatform.deploymentTransaction().wait()
  const address = await podFiPlatform.getAddress()
  console.log("PodFiPlatform deployed to:", address)
  // Wait for Etherscan to recognize the contract (optional but recommended)
  console.log("Waiting for Etherscan to recognize the contract...")
  await new Promise((resolve) => setTimeout(resolve, 60000)) // Wait 1 minute

  // Verify the contract on Etherscan
  console.log("Verifying contract on Etherscan...")
  try {
    await run("verify:verify", {
      address: address,
      constructorArguments: [nativeTokenAddress, exclusiveContentAddress, stakingDuration, rewardAmount.toString()],
    })
    console.log("Contract verified successfully!")
  } catch (error) {
    console.error("Verification failed:", error)
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
