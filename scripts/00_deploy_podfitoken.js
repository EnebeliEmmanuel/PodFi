// scripts/deploy.js
const hre = require("hardhat")

async function main() {
  const initialSupply = hre.ethers.parseUnits("1000000", 18) // 1,000,000 POD with 18 decimals
  const PodFiToken = await hre.ethers.getContractFactory("PodFiToken")
  const podFiToken = await PodFiToken.deploy(initialSupply)

  await podFiToken.waitForDeployment()

  console.log("PodFiToken deployed to:", await podFiToken.getAddress())
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
