const { exec } = require("child_process");
const { promisify } = require("util");
const path = require("path");

const execAsync = promisify(exec);

async function migrate() {
  console.log("========================================");
  console.log("🔄 Running Database Migrations");
  console.log("========================================");

  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is not set!");
    process.exit(1);
  }

  const prismaPath = path.join(__dirname, "node_modules", ".bin", "prisma");

  try {
    console.log("📦 Checking Prisma version...");
    const { stdout: version } = await execAsync(`${prismaPath} --version`);
    console.log(version);

    console.log("\n🚀 Deploying migrations...");
    const { stdout } = await execAsync(`${prismaPath} migrate deploy`);
    console.log(stdout);
    console.log("✅ Migrations complete!\n");
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    process.exit(1);
  }
}

migrate();
