const { ethers } = require("hardhat")
const fs = require("fs")
async function main() {
  const name = "PodFi Token" // Replace with your token name
  const symbol = "PFT" // Replace with your token symbol

  // Get the contract factory
  const NativeToken = await ethers.getContractFactory("NativeToken")

  // Deploy the contract
  console.log("Deploying NativeToken...")
  const nativeToken = await NativeToken.deploy(name, symbol)

  // Wait for the deployment to complete
  await nativeToken.deploymentTransaction().wait()

  const address = await nativeToken.getAddress()
  console.log("NativeToken deployed to:", address)

  // Save the contract address to a file
  fs.writeFileSync("nativeTokenAddress.txt", address)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
