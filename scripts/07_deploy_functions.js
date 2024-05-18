const { ethers, run } = require("hardhat")
const fs = require("fs")

async function main() {
  const router = "0xb83E47C2bC239B3bf370bc41e1459A34b41238D0" // Replace with your Chainlink router address
  const donId = "0x66756e2d657468657265756d2d7365706f6c69612d3100000000000000000000" // Replace with your DON ID

  // Get the contract factory
  const FunctionsConsumer = await ethers.getContractFactory("FunctionsConsumer")

  // Deploy the contract
  console.log("Deploying FunctionsConsumer...")
  const feeData = await ethers.provider.getFeeData()

  const gasLimit = 600000 // Increased gas limit

  try {
    const functionsConsumer = await FunctionsConsumer.deploy(router, donId)

    // Wait for the deployment to complete
    await functionsConsumer.deploymentTransaction().wait()

    const address = await functionsConsumer.getAddress()
    console.log("FunctionsConsumer deployed to:", address)

    // Save the contract address to a file
    fs.writeFileSync("functionsConsumer.txt", address)

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
  } catch (error) {
    console.error("Deployment failed:", error)
  }
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
