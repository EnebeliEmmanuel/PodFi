// scripts/deploy.js
const { ethers, upgrades } = require("hardhat")

async function main() {
  // Get the contract factory
  const PodfiPodcast = await ethers.getContractFactory("PodfiPodcast")

  // Deploy the contract
  console.log("Deploying PodfiPodcast...")
  const podfiPodcast = await upgrades.deployProxy(PodfiPodcast, [], { initializer: "initialize" })

  // Wait for the deployment to complete
  await podfiPodcast.deploymentTransaction().wait()

  console.log("PodfiPodcast deployed to:", await podfiPodcast.getAddress())
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
