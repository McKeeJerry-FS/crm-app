const { exec, spawn } = require("child_process");
const { promisify } = require("util");
const path = require("path");

const execAsync = promisify(exec);

async function main() {
  console.log("========================================");
  console.log("🔍 Environment Check");
  console.log("========================================");
  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
  console.log(
    "DATABASE_URL (first 50 chars):",
    process.env.DATABASE_URL?.substring(0, 50),
  );

  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is not set!");
    process.exit(1);
  }

  // Use local Prisma instead of npx
  const prismaPath = path.join(__dirname, "node_modules", ".bin", "prisma");

  console.log("\n========================================");
  console.log("🔄 Running Prisma Migrations");
  console.log("========================================");

  try {
    // Check Prisma version
    console.log("📦 Checking Prisma version...");
    const { stdout: version } = await execAsync(`${prismaPath} --version`, {
      env: { ...process.env },
    });
    console.log(version);

    // Run migrations using local Prisma
    console.log("\n🚀 Deploying migrations...");
    const { stdout, stderr } = await execAsync(`${prismaPath} migrate deploy`, {
      env: { ...process.env },
    });

    console.log("✅ Migration stdout:");
    console.log(stdout);

    if (stderr) {
      console.log("⚠️  Migration stderr:");
      console.log(stderr);
    }

    console.log("\n========================================");
    console.log("✅ Database Setup Complete!");
    console.log("========================================");
    console.log("🚀 Starting Next.js server...\n");

    // Start Next.js server
    const nextServer = spawn("node", ["./node_modules/.bin/next", "start"], {
      stdio: "inherit",
      env: { ...process.env },
    });

    nextServer.on("error", (error) => {
      console.error("\n❌ Failed to start Next.js:", error);
      process.exit(1);
    });

    nextServer.on("exit", (code) => {
      if (code !== 0) {
        console.error(`\n❌ Next.js exited with code ${code}`);
        process.exit(code);
      }
    });
  } catch (error) {
    console.error("\n========================================");
    console.error("❌ Setup Failed");
    console.error("========================================");
    console.error("Error message:", error.message);
    console.error("Error stdout:", error.stdout);
    console.error("Error stderr:", error.stderr);
    process.exit(1);
  }
}

main();
