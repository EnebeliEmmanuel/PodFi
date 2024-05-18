// scripts/deploy.js
const { ethers } = require("hardhat")
const fs = require("fs")

async function main() {
  const initialSupply = ethers.parseUnits("10000", 18) // 1,000,000 POD with 18 decimals
  const PodFiToken = await ethers.getContractFactory("PodFiToken")
  const feeData = await ethers.provider.getFeeData()

  const podFiToken = await PodFiToken.deploy(initialSupply, {
    maxFeePerGas: feeData.maxFeePerGas, // Use the retrieved maxFeePerGas
    maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
  })
  await podFiToken.deploymentTransaction().wait()

  const address = await podFiToken.getAddress()
  console.log("NativeToken deployed to:", address)

  // Save the contract address to a file
  fs.writeFileSync("podFiToken.txt", address)
  // Wait for Etherscan to recognize the contract (optional but recommended)
  console.log("Waiting for Etherscan to recognize the contract...")
  await new Promise((resolve) => setTimeout(resolve, 60000)) // Wait 1 minute

  // Verify the contract on Etherscan
  console.log("Verifying contract on Etherscan...")
  try {
    await run("verify:verify", {
      address: address,
      constructorArguments: [initialSupply],
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
