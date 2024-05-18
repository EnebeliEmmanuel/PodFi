const { ethers } = require("hardhat")

async function main() {
  const name = "PodFiNFT" // Replace with your token name
  const symbol = "PFNFT" // Replace with your token symbol

  const vrfCoordinator = "0xYourVrfCoordinatorAddress" // Replace with your VRF Coordinator address
  const linkToken = "0xYourLinkTokenAddress" // Replace with your LINK token address
  const keyHash = "0xYourKeyHash" // Replace with your key hash
  const fee = ethers.parseUnits("0.1", 18) // Replace with your fee

  // Get the contract factory
  const PodFiContract = await ethers.getContractFactory("PodFiContract")

  // Deploy the contract
  console.log("Deploying PodFiContract...")
  const podFiContract = await PodFiContract.deploy(name, symbol, vrfCoordinator, linkToken, keyHash, fee)

  // Wait for the deployment to complete
  await podFiContract.deploymentTransaction().wait()

  console.log("PodFiContract deployed to:", await podFiContract.getAddress())
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
