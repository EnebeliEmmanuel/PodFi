// scripts/deploy.js
const hre = require("hardhat");

async function main() {
    const initialSupply = hre.ethers.utils.parseEther("1000000"); // 1,000,000 POD
    const PodFiToken = await hre.ethers.getContractFactory("PodFiToken");
    const podFiToken = await PodFiToken.deploy(initialSupply);

    await podFiToken.deployed();

    console.log("PodFiToken deployed to:", podFiToken.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
