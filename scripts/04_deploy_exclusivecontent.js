const { ethers, run } = require("hardhat")
const fs = require("fs")

async function main() {
  const name = "ExclusiveContentNFT"
  const symbol = "ECNFT"
  const baseTokenURI =
    "https://pink-alert-giraffe-827.mypinata.cloud/ipfs/Qmb6tWBDLd9j2oSnvSNhE314WFL7SRpQNtfwjFWsStXp5A/"
  const vrfCoordinator = "0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B" // Replace with the actual VRF Coordinator address
  const linkToken = "0x779877A7B0D9E8603169DdbD7836e478b4624789" // Replace with the actual LINK token address
  const keyHash = "0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae" // Replace with the actual key hash
  const fee = ethers.parseUnits("0.001", 18) // 0.1 LINK fee

  // Get the contract factory
  const ExclusiveContentNFT = await ethers.getContractFactory("ExclusiveContentNFT")
  const feeData = await ethers.provider.getFeeData()

  // Deploy the contract
  console.log("Deploying ExclusiveContentNFT...")
  const gasLimit = 500000 // Set a higher gas limit for deployment
  const exclusiveContentNFT = await ExclusiveContentNFT.deploy(
    name,
    symbol,
    baseTokenURI,
    vrfCoordinator,
    linkToken,
    keyHash,
    fee,
    {
      maxFeePerGas: feeData.maxFeePerGas, // Use the retrieved maxFeePerGas
      maxPriorityFeePerGas: feeData.maxPriorityFeePerGas,
      gasLimit: gasLimit, // Explicitly set the gas limit
    }
  )

  // Wait for the deployment to complete
  await exclusiveContentNFT.deploymentTransaction().wait()
  const address = await exclusiveContentNFT.getAddress()
  console.log("ExclusiveContentNFT deployed to:", address)

  // Save the contract address to a file
  fs.writeFileSync("exclusiveContentNFT.txt", address)
  // Wait for Etherscan to recognize the contract (optional but recommended)
  console.log("Waiting for Etherscan to recognize the contract...")
  await new Promise((resolve) => setTimeout(resolve, 60000)) // Wait 1 minute

  // Verify the contract on Etherscan
  console.log("Verifying contract on Etherscan...")
  try {
    await run("verify:verify", {
      address: address,
      constructorArguments: [name, symbol, baseTokenURI, vrfCoordinator, linkToken, keyHash, fee.toString()],
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
