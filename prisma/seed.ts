import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Clear existing data
  await prisma.deal.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.customer.deleteMany();

  // Seed Customers
  const customer1 = await prisma.customer.create({
    data: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '555-0101',
      address: '123 Main St, New York, NY 10001',
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      phone: '555-0102',
      address: '456 Oak Ave, Los Angeles, CA 90001',
    },
  });

  const customer3 = await prisma.customer.create({
    data: {
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      phone: '555-0103',
      address: '789 Pine Rd, Chicago, IL 60601',
    },
  });

  console.log('Created customers:', { customer1, customer2, customer3 });

  // Seed Contacts
  const contact1 = await prisma.contact.create({
    data: {
      name: 'Alice Williams',
      email: 'alice.williams@techcorp.com',
      phone: '555-0201',
      company: 'TechCorp Inc',
    },
  });

  const contact2 = await prisma.contact.create({
    data: {
      name: 'Charlie Brown',
      email: 'charlie.brown@innovate.com',
      phone: '555-0202',
      company: 'Innovate Solutions',
    },
  });

  const contact3 = await prisma.contact.create({
    data: {
      name: 'Diana Prince',
      email: 'diana.prince@global.com',
      phone: '555-0203',
      company: 'Global Enterprises',
    },
  });

  const contact4 = await prisma.contact.create({
    data: {
      name: 'Edward Norton',
      email: 'edward.norton@startup.io',
      phone: '555-0204',
      company: 'Startup.io',
    },
  });

  console.log('Created contacts:', { contact1, contact2, contact3, contact4 });

  // Seed Deals
  const deal1 = await prisma.deal.create({
    data: {
      title: 'Enterprise Software License',
      description: 'Annual license for 50 users with premium support',
      value: 75000,
      amount: 75000,
      status: 'In Progress',
    },
  });

  const deal2 = await prisma.deal.create({
    data: {
      title: 'Website Redesign Project',
      description: 'Complete website overhaul with new branding',
      value: 25000,
      amount: 25000,
      status: 'Open',
    },
  });

  const deal3 = await prisma.deal.create({
    data: {
      title: 'Cloud Migration Services',
      description: 'Migrate infrastructure to AWS cloud platform',
      value: 150000,
      amount: 150000,
      status: 'Won',
    },
  });

  const deal4 = await prisma.deal.create({
    data: {
      title: 'Mobile App Development',
      description: 'Native iOS and Android app development',
      value: 95000,
      amount: 95000,
      status: 'In Progress',
    },
  });

  const deal5 = await prisma.deal.create({
    data: {
      title: 'Consulting Services',
      description: 'Strategic consulting for digital transformation',
      value: 45000,
      amount: 45000,
      status: 'Lost',
    },
  });

  console.log('Created deals:', { deal1, deal2, deal3, deal4, deal5 });

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });