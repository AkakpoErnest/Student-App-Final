const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying Escrow contract to local network...");

  // Get the contract factory
  const Escrow = await ethers.getContractFactory("Escrow");

  // Deploy the contract
  const escrow = await Escrow.deploy();

  // Wait for deployment to complete
  await escrow.waitForDeployment();

  const escrowAddress = await escrow.getAddress();

  console.log("Escrow contract deployed to:", escrowAddress);
  console.log("Deployment transaction hash:", escrow.deploymentTransaction()?.hash);

  // Test basic functionality
  console.log("\nTesting contract functionality...");
  
  // Get contract info
  const owner = await escrow.owner();
  const platformFee = await escrow.platformFee();
  const contractBalance = await escrow.getContractBalance();
  
  console.log("Contract owner:", owner);
  console.log("Platform fee:", platformFee.toString(), "basis points");
  console.log("Contract balance:", ethers.formatEther(contractBalance), "ETH");

  console.log("\n✅ Contract deployed successfully!");
  console.log("📝 Update ESCROW_CONTRACT_ADDRESS in src/integrations/blockchain/client.ts with:", escrowAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
