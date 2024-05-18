// scripts/deploy.js
const { ethers } = require("hardhat")

async function main() {
  const ccipAddress = "0xYourCcipAddress" // Replace with your CCIP address
  const nativeTokenAddress = "0xYourNativeTokenAddress" // Replace with your POD token address

  // Get the contract factory
  const CCIPTokenRewards = await ethers.getContractFactory("CCIPTokenRewards")

  // Deploy the contract
  console.log("Deploying CCIPTokenRewards...")
  const ccipTokenRewards = await CCIPTokenRewards.deploy(ccipAddress, nativeTokenAddress)

  // Wait for the deployment to complete
  await ccipTokenRewards.deployed()

  console.log("CCIPTokenRewards deployed to:", ccipTokenRewards.address)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
