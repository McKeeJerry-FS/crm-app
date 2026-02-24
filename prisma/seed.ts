import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seed...");

  // Check if users already exist
  const existingUsers = await prisma.user.count();
  if (existingUsers > 0) {
    console.log("⚠️  Users already exist, skipping seed");
    return;
  }

  const hashedPassword = await bcrypt.hash("password123", 10);

  console.log("Creating admin user...");
  await prisma.user.create({
    data: {
      email: "admin@crm.com",
      password: hashedPassword,
      name: "Admin User",
      role: "ADMIN",
    },
  });

  console.log("Creating regular user...");
  await prisma.user.create({
    data: {
      email: "user@crm.com",
      password: hashedPassword,
      name: "Regular User",
      role: "USER",
    },
  });

  console.log("✅ Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
