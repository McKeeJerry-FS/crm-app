const { exec, spawn } = require("child_process");
const { promisify } = require("util");

const execAsync = promisify(exec);

async function main() {
  console.log("🔍 Checking DATABASE_URL...");
  console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);

  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is not set!");
    process.exit(1);
  }

  console.log("🔄 Running Prisma migrations...");

  try {
    // Run migration with explicit environment
    const { stdout, stderr } = await execAsync("npx prisma migrate deploy", {
      env: { ...process.env },
    });

    console.log("Migration output:", stdout);
    if (stderr && !stderr.includes("warning")) {
      console.error("Migration stderr:", stderr);
    }

    console.log("✅ Migrations completed successfully!");
    console.log("🚀 Starting Next.js server...");

    // Start Next.js server
    const nextServer = spawn("node", ["./node_modules/.bin/next", "start"], {
      stdio: "inherit",
      env: { ...process.env },
    });

    nextServer.on("error", (error) => {
      console.error("❌ Failed to start Next.js:", error);
      process.exit(1);
    });

    nextServer.on("exit", (code) => {
      if (code !== 0) {
        console.error(`❌ Next.js exited with code ${code}`);
        process.exit(code);
      }
    });
  } catch (error) {
    console.error("❌ Migration failed:", error.message);
    console.error("Full error:", error);
    process.exit(1);
  }
}

main();
