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

    // Run seeding separately with better error handling
    try {
      console.log("\n========================================");
      console.log("🌱 Seeding Database");
      console.log("========================================");

      const { stdout: seedOutput, stderr: seedError } = await execAsync(
        `${prismaPath} db seed`,
      );
      console.log(seedOutput);
      if (seedError) console.log("Seed stderr:", seedError);
      console.log("✅ Seeding complete!\n");
    } catch (error) {
      console.error("❌ Seeding failed:", error.message);
      if (error.stdout) console.log("Seed stdout:", error.stdout);
      if (error.stderr) console.error("Seed stderr:", error.stderr);

      // Check if it's a "unique constraint" error (data already exists)
      if (
        error.message.includes("Unique constraint") ||
        error.stderr?.includes("Unique constraint")
      ) {
        console.log("⚠️  Data already exists, skipping seed...\n");
      } else {
        console.log("⚠️  Seeding failed, but continuing deployment...\n");
      }
    }
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    if (error.stdout) console.log(error.stdout);
    if (error.stderr) console.error(error.stderr);
    process.exit(1);
  }
}

migrate();
