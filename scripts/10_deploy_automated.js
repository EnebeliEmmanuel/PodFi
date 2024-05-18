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
  const address = await automatedFunctionsConsumer.getAddress()

  console.log("AutomatedFunctionsConsumer deployed to:", address)
  // Wait for Etherscan to recognize the contract (optional but recommended)
  console.log("Waiting for Etherscan to recognize the contract...")
  await new Promise((resolve) => setTimeout(resolve, 60000)) // Wait 1 minute

  // Verify the contract on Etherscan
  console.log("Verifying contract on Etherscan...")
  try {
    await run("verify:verify", {
      address: address,
      constructorArguments: [router, donId],
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
