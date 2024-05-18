const { ethers, upgrades } = require("hardhat")

async function main() {
  // Get the contract factory
  const PodfiAdsMarketplace = await ethers.getContractFactory("PodfiAdsMarketplace")

  // Deploy the contract
  console.log("Deploying PodfiAdsMarketplace...")
  const podfiAdsMarketplace = await upgrades.deployProxy(PodfiAdsMarketplace, [], { initializer: "initialize" })

  // Wait for the deployment to complete
  await podfiAdsMarketplace.deploymentTransaction().wait()
  const address = await podfiAdsMarketplace.getAddress()
  console.log("PodfiAdsMarketplace deployed to:", address)
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
