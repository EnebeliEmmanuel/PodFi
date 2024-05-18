const { ethers } = require("hardhat")

async function main() {
  const router = "0xb83E47C2bC239B3bf370bc41e1459A34b41238D0" // Replace with your Chainlink router address
  const donId = "0x66756e2d657468657265756d2d7365706f6c69612d3100000000000000000000" // Replace with your DON ID

  // Get the contract factory
  const AutomatedFunctionsConsumer = await ethers.getContractFactory("AutomatedFunctionsConsumer")

  // Deploy the contract
  console.log("Deploying AutomatedFunctionsConsumer...")
  const automatedFunctionsConsumer = await AutomatedFunctionsConsumer.deploy(router, donId)

  // Wait for the deployment to complete
  await automatedFunctionsConsumer.deploymentTransaction().wait()

  console.log("AutomatedFunctionsConsumer deployed to:", await automatedFunctionsConsumer.getAddress())
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
