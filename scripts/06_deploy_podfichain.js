const { ethers } = require("hardhat")

async function main() {
  const name = "PodFiNFT" // Replace with your token name
  const symbol = "PFNFT" // Replace with your token symbol

  const vrfCoordinator = "0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B" // Replace with your VRF Coordinator address
  const linkToken = "0x779877A7B0D9E8603169DdbD7836e478b4624789" // Replace with your LINK token address
  const keyHash = "0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae" // Replace with your key hash
  const fee = ethers.parseUnits("0.1", 18) // Replace with your fee

  // Get the contract factory
  //   const PodFiContract = await ethers.getContractFactory("PodFiContract")

  //   const podFiContract = await PodFiContract.deploy(name, symbol, vrfCoordinator, linkToken, jobId, fee)

  //   // Wait for the deployment to complete
  //   await podFiContract.deploymentTransaction().wait()

  //   console.log("PodFiContract deployed to:", await podFiContract.getAddress())
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
