const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying Escrow contract...");

  // Get the contract factory
  const Escrow = await ethers.getContractFactory("Escrow");

  // Deploy the contract
  const escrow = await Escrow.deploy();

  // Wait for deployment to complete
  await escrow.waitForDeployment();

  const escrowAddress = await escrow.getAddress();

  console.log("Escrow contract deployed to:", escrowAddress);
  console.log("Deployment transaction hash:", escrow.deploymentTransaction()?.hash);

  // Verify the contract (optional, requires BASESCAN_API_KEY)
  if (process.env.BASESCAN_API_KEY) {
    console.log("Waiting for block confirmations...");
    await escrow.deploymentTransaction()?.wait(6);
    
    try {
      await hre.run("verify:verify", {
        address: escrowAddress,
        constructorArguments: [],
      });
      console.log("Contract verified on Basescan!");
    } catch (error) {
      console.log("Verification failed:", error);
    }
  }

  // Save deployment info
  const deploymentInfo = {
    network: hre.network.name,
    contractAddress: escrowAddress,
    deploymentTx: escrow.deploymentTransaction()?.hash,
    timestamp: new Date().toISOString(),
  };

  console.log("\nDeployment Summary:");
  console.log(JSON.stringify(deploymentInfo, null, 2));

  console.log("\nNext steps:");
  console.log("1. Update ESCROW_CONTRACT_ADDRESS in src/integrations/blockchain/client.ts");
  console.log("2. Test the contract functionality");
  console.log("3. Deploy to mainnet when ready");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
