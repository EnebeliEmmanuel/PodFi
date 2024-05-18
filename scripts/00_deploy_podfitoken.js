// scripts/deploy.js
const hre = require("hardhat")
const fs = require("fs")

async function main() {
  const initialSupply = hre.ethers.parseUnits("1000000", 18) // 1,000,000 POD with 18 decimals
  const PodFiToken = await hre.ethers.getContractFactory("PodFiToken")
  const podFiToken = await PodFiToken.deploy(initialSupply)

  await podFiToken.waitForDeployment()

  const address = await await podFiToken.getAddress()
  console.log("NativeToken deployed to:", address)

  // Save the contract address to a file
  fs.writeFileSync("podFiToken.txt", address)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
