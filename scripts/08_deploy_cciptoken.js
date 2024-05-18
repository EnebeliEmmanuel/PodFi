const { ethers } = require("hardhat")
const fs = require("fs")

async function main() {
  const ccipAddress = "0x0BF3dE8c5D3e8A2B34D2BEeB17ABfCeBaf363A59" // Replace with your CCIP address
  const podFiToken = fs.readFileSync("podFiToken.txt", "utf8").trim()

  // Get the contract factory
  const CCIPTokenRewards = await ethers.getContractFactory("CCIPTokenRewards")

  // Deploy the contract
  console.log("Deploying CCIPTokenRewards...")
  const ccipTokenRewards = await CCIPTokenRewards.deploy(ccipAddress, podFiToken)

  // Wait for the deployment to complete
  await ccipTokenRewards.deploymentTransaction().wait()

  const address = await ccipTokenRewards.getAddress()

  console.log("CCIPTokenRewards deployed to:", address)
  // Wait for Etherscan to recognize the contract (optional but recommended)
  console.log("Waiting for Etherscan to recognize the contract...")
  await new Promise((resolve) => setTimeout(resolve, 60000)) // Wait 1 minute

  // Verify the contract on Etherscan
  console.log("Verifying contract on Etherscan...")
  try {
    await run("verify:verify", {
      address: address,
      constructorArguments: [ccipAddress, podFiToken],
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
