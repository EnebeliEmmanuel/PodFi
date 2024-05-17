// scripts/deploy.js
const { ethers, upgrades } = require("hardhat")

async function main() {
  // Get the contract factory
  const PodfiAdsMarketplace = await ethers.getContractFactory("PodfiAdsMarketplace")

  // Deploy the contract
  console.log("Deploying PodfiAdsMarketplace...")
  const podfiAdsMarketplace = await upgrades.deployProxy(PodfiAdsMarketplace, [], { initializer: "initialize" })

  // Wait for the deployment to complete
  await podfiAdsMarketplace.deployed()

  console.log("PodfiAdsMarketplace deployed to:", podfiAdsMarketplace.address)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
