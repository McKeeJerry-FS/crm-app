const { exec, spawn } = require("child_process");
const { promisify } = require("util");

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

  console.log("\n========================================");
  console.log("🔄 Running Prisma Migrations");
  console.log("========================================");

  try {
    // Check Prisma schema first
    console.log("📋 Checking Prisma schema...");
    const { stdout: schemaCheck } = await execAsync("npx prisma validate", {
      env: { ...process.env },
    });
    console.log(schemaCheck);

    // Run migrations
    console.log("\n🚀 Deploying migrations...");
    const { stdout, stderr } = await execAsync("npx prisma migrate deploy", {
      env: { ...process.env },
    });

    console.log("✅ Migration stdout:");
    console.log(stdout);

    if (stderr) {
      console.log("⚠️  Migration stderr:");
      console.log(stderr);
    }

    // Verify tables were created
    console.log("\n🔍 Verifying database schema...");
    const { stdout: introspect } = await execAsync(
      "npx prisma db execute --stdin",
      {
        env: { ...process.env },
        input:
          "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';",
      },
    ).catch(() => ({ stdout: "Could not verify tables" }));
    console.log("Tables in database:", introspect);

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
    console.error("Full error:", error);
    process.exit(1);
  }
}

main();
