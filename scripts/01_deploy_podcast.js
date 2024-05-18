const { ethers, upgrades, run } = require("hardhat")

async function main() {
  // Get the contract factory
  const PodfiPodcast = await ethers.getContractFactory("PodfiPodcast")

  // Deploy the contract
  console.log("Deploying PodfiPodcast...")
  const feeData = await ethers.provider.getFeeData()

  const podfiPodcast = await upgrades.deployProxy(
    PodfiPodcast,
    [],
    { initializer: "initialize" },
    {
      maxFeePerGas: feeData.maxFeePerGas,
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
    }
  )

  // Wait for the deployment to complete
  await podfiPodcast.deploymentTransaction().wait()

  const address = await podfiPodcast.getAddress()
  console.log("PodfiPodcast deployed to:", address)

  // Wait for Etherscan to recognize the contract (optional but recommended)
  console.log("Waiting for Etherscan to recognize the contract...")
  await new Promise((resolve) => setTimeout(resolve, 60000)) // Wait 1 minute

  // Verify the contract on Etherscan
  console.log("Verifying contract on Etherscan...")
  try {
    await run("verify:verify", {
      address: address,
      constructorArguments: [],
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
