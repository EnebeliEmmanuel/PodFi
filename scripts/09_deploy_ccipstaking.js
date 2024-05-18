const { ethers } = require("hardhat")

async function main() {
  const ccipAddress = "0xYourCcipAddress" // Replace with your CCIP address
  const nativeTokenAddress = "0xYourNativeTokenAddress" // Replace with your POD token address

  // Get the contract factory
  const CrossChainStaking = await ethers.getContractFactory("CrossChainStaking")

  // Deploy the contract
  console.log("Deploying CrossChainStaking...")
  const crossChainStaking = await CrossChainStaking.deploy(ccipAddress, nativeTokenAddress)

  // Wait for the deployment to complete
  await crossChainStaking.deploymentTransaction().wait()

  console.log("CrossChainStaking deployed to:", await crossChainStaking.getAddress())
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
