const hre = require("hardhat");
const { ethers } = hre;

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying PHU81 with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "MATIC");

  const initialSupply = process.env.INITIAL_SUPPLY
    ? BigInt(process.env.INITIAL_SUPPLY)
    : 1_000_000_000n; // 1 billion default

  console.log("Initial supply:", initialSupply.toString(), "PHU81");

  const PHU81 = await ethers.getContractFactory("PHU81");
  const token = await PHU81.deploy(initialSupply);
  await token.waitForDeployment();

  const address = await token.getAddress();
  console.log("PHU81 deployed to:", address);
  console.log(
    "Total supply:",
    ethers.formatEther(await token.totalSupply()),
    "PHU81"
  );

  // Persist the address for downstream tooling (e.g. verify script)
  const fs = require("fs");
  const deploymentInfo = {
    network: hre.network.name,
    address,
    deployer: deployer.address,
    initialSupply: initialSupply.toString(),
    deployedAt: new Date().toISOString(),
  };
  fs.writeFileSync(
    "deployment.json",
    JSON.stringify(deploymentInfo, null, 2)
  );
  console.log("Deployment info saved to deployment.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
