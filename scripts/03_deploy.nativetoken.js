const { ethers } = require("hardhat")
const fs = require("fs")
async function main() {
  const name = "PodFi Token" // Replace with your token name
  const symbol = "PFT" // Replace with your token symbol

  // Get the contract factory
  const NativeToken = await ethers.getContractFactory("NativeToken")
  const feeData = await ethers.provider.getFeeData()

  // Deploy the contract
  console.log("Deploying NativeToken...")
  const nativeToken = await NativeToken.deploy(name, symbol)

  // Wait for the deployment to complete
  await nativeToken.deploymentTransaction().wait()

  const address = await nativeToken.getAddress()
  console.log("NativeToken deployed to:", address)

  // Save the contract address to a file
  fs.writeFileSync("nativeTokenAddress.txt", address)
  // Wait for Etherscan to recognize the contract (optional but recommended)
  console.log("Waiting for Etherscan to recognize the contract...")
  await new Promise((resolve) => setTimeout(resolve, 60000)) // Wait 1 minute

  // Verify the contract on Etherscan
  console.log("Verifying contract on Etherscan...")
  try {
    await run("verify:verify", {
      address: address,
      constructorArguments: [name, symbol],
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
