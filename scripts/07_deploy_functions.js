// scripts/deploy.js
const { ethers } = require("hardhat")

async function main() {
  const router = "0xYourRouterAddress" // Replace with your Chainlink router address
  const donId = "0xYourDonId" // Replace with your DON ID

  // Get the contract factory
  const FunctionsConsumer = await ethers.getContractFactory("FunctionsConsumer")

  // Deploy the contract
  console.log("Deploying FunctionsConsumer...")
  const functionsConsumer = await FunctionsConsumer.deploy(router, donId)

  // Wait for the deployment to complete
  await functionsConsumer.deployed()

  console.log("FunctionsConsumer deployed to:", functionsConsumer.address)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
