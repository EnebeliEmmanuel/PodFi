const { ethers } = require("hardhat")

async function main() {
  const router = "0xYourRouterAddress" // Replace with your Chainlink router address
  const donId = "0xYourDonId" // Replace with your DON ID

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
