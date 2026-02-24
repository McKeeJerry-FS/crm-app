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
    const { stdout: migrateOutput } = await execAsync(
      `${prismaPath} migrate deploy`,
    );
    console.log(migrateOutput);
    console.log("✅ Migrations complete!");

    console.log("\n========================================");
    console.log("🌱 Seeding Database");
    console.log("========================================");

    const { stdout: seedOutput } = await execAsync(`${prismaPath} db seed`);
    console.log(seedOutput);
    console.log("✅ Seeding complete!\n");
  } catch (error) {
    console.error("❌ Setup failed:", error.message);
    if (error.stdout) console.log(error.stdout);
    if (error.stderr) console.error(error.stderr);

    // Don't exit if seeding fails (data might already exist)
    if (error.message.includes("seed")) {
      console.log("⚠️  Seeding failed, but continuing...");
    } else {
      process.exit(1);
    }
  }
}

migrate();
