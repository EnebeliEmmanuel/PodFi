// scripts/deploy.js
const { ethers, upgrades } = require("hardhat")

async function main() {
  // Get the contract factory
  const PodfiPodcast = await ethers.getContractFactory("PodfiPodcast")

  // Deploy the contract
  console.log("Deploying PodfiPodcast...")
  const podfiPodcast = await upgrades.deployProxy(PodfiPodcast, [], { initializer: "initialize" })

  // Wait for the deployment to complete
  await podfiPodcast.deployed()

  console.log("PodfiPodcast deployed to:", podfiPodcast.address)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
