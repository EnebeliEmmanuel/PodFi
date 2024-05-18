const { ethers } = require("hardhat")
const fs = require("fs")

async function main() {
  const ccipAddress = "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59" // Replace with your CCIP address
  const podFiToken = fs.readFileSync("podFiToken.txt", "utf8").trim()
  // Get the contract factory
  const CrossChainStaking = await ethers.getContractFactory("CrossChainStaking")

  // Deploy the contract
  console.log("Deploying CrossChainStaking...")
  const crossChainStaking = await CrossChainStaking.deploy(ccipAddress, podFiToken)

  // Wait for the deployment to complete
  await crossChainStaking.deploymentTransaction().wait()

  console.log("CrossChainStaking deployed to:", await crossChainStaking.getAddress())
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
