import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');

  // ========== CREATE USERS ==========
  console.log('👥 Creating users...');
  
  const hashedPasswordAdmin = await bcrypt.hash('admin123', 10);
  const hashedPasswordManager = await bcrypt.hash('manager123', 10);
  const hashedPasswordUser = await bcrypt.hash('user123', 10);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@crm.com' },
    update: {},
    create: {
      email: 'admin@crm.com',
      name: 'Admin User',
      password: hashedPasswordAdmin,
      role: 'admin',
    },
  });

  const managerUser = await prisma.user.upsert({
    where: { email: 'manager@crm.com' },
    update: {},
    create: {
      email: 'manager@crm.com',
      name: 'Manager User',
      password: hashedPasswordManager,
      role: 'manager',
    },
  });

  const regularUser = await prisma.user.upsert({
    where: { email: 'user@crm.com' },
    update: {},
    create: {
      email: 'user@crm.com',
      name: 'Regular User',
      password: hashedPasswordUser,
      role: 'user',
    },
  });

  console.log('✅ Created 3 users (admin, manager, user)');

  // ========== CREATE CUSTOMERS ==========
  console.log('🏢 Creating customers...');
  
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        name: 'Acme Corporation',
        email: 'contact@acme.com',
        phone: '+1-555-0100',
        company: 'Acme Corp',
        address: '123 Business St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA',
        status: 'Active',
        userId: adminUser.id,
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Tech Innovations LLC',
        email: 'hello@techinnovations.com',
        phone: '+1-555-0200',
        company: 'Tech Innovations',
        address: '456 Innovation Ave',
        city: 'San Francisco',
        state: 'CA',
        zipCode: '94102',
        country: 'USA',
        status: 'Active',
        userId: managerUser.id,
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Global Services Inc',
        email: 'info@globalservices.com',
        phone: '+1-555-0300',
        company: 'Global Services',
        address: '789 Enterprise Blvd',
        city: 'Chicago',
        state: 'IL',
        zipCode: '60601',
        country: 'USA',
        status: 'Active',
        userId: regularUser.id,
      },
    }),
    prisma.customer.create({
      data: {
        name: 'StartUp Ventures',
        email: 'team@startupventures.com',
        phone: '+1-555-0400',
        company: 'StartUp Ventures',
        address: '321 Silicon Valley Rd',
        city: 'Palo Alto',
        state: 'CA',
        zipCode: '94301',
        country: 'USA',
        status: 'Active',
        userId: adminUser.id,
      },
    }),
    prisma.customer.create({
      data: {
        name: 'Enterprise Solutions Ltd',
        email: 'contact@enterprisesolutions.com',
        phone: '+1-555-0500',
        company: 'Enterprise Solutions',
        address: '555 Corporate Plaza',
        city: 'Boston',
        state: 'MA',
        zipCode: '02101',
        country: 'USA',
        status: 'Active',
        userId: managerUser.id,
      },
    }),
  ]);

  console.log(`✅ Created ${customers.length} customers`);

  // ========== CREATE CONTACTS ==========
  console.log('📞 Creating contacts...');
  
  const contacts = await prisma.contact.createMany({
    data: [
      {
        firstName: 'John',
        lastName: 'Smith',
        email: 'john.smith@acme.com',
        phone: '+1-555-0101',
        position: 'CEO',
        customerId: customers[0].id,
        userId: adminUser.id,
      },
      {
        firstName: 'Sarah',
        lastName: 'Johnson',
        email: 'sarah.j@techinnovations.com',
        phone: '+1-555-0201',
        position: 'CTO',
        customerId: customers[1].id,
        userId: managerUser.id,
      },
      {
        firstName: 'Michael',
        lastName: 'Brown',
        email: 'michael.b@globalservices.com',
        phone: '+1-555-0301',
        position: 'VP Sales',
        customerId: customers[2].id,
        userId: regularUser.id,
      },
      {
        firstName: 'Emily',
        lastName: 'Davis',
        email: 'emily.d@startupventures.com',
        phone: '+1-555-0401',
        position: 'Founder',
        customerId: customers[3].id,
        userId: adminUser.id,
      },
      {
        firstName: 'Robert',
        lastName: 'Wilson',
        email: 'robert.w@enterprisesolutions.com',
        phone: '+1-555-0501',
        position: 'CFO',
        customerId: customers[4].id,
        userId: managerUser.id,
      },
      {
        firstName: 'Jennifer',
        lastName: 'Martinez',
        email: 'jennifer.m@acme.com',
        phone: '+1-555-0102',
        position: 'Marketing Director',
        customerId: customers[0].id,
        userId: adminUser.id,
      },
    ],
  });

  console.log(`✅ Created ${contacts.count} contacts`);

  // ========== CREATE DEALS ==========
  console.log('💼 Creating deals...');
  
  const deals = await Promise.all([
    prisma.deal.create({
      data: {
        title: 'Enterprise Software License',
        value: 50000,
        status: 'Won',
        stage: 'Closed Won',
        probability: 100,
        expectedCloseDate: new Date('2024-03-15'),
        customerId: customers[0].id,
        userId: adminUser.id,
      },
    }),
    prisma.deal.create({
      data: {
        title: 'Cloud Infrastructure Setup',
        value: 75000,
        status: 'In Progress',
        stage: 'Negotiation',
        probability: 70,
        expectedCloseDate: new Date('2024-04-30'),
        customerId: customers[1].id,
        userId: managerUser.id,
      },
    }),
    prisma.deal.create({
      data: {
        title: 'Consulting Services Package',
        value: 30000,
        status: 'Open',
        stage: 'Prospecting',
        probability: 40,
        expectedCloseDate: new Date('2024-05-15'),
        customerId: customers[2].id,
        userId: regularUser.id,
      },
    }),
    prisma.deal.create({
      data: {
        title: 'Mobile App Development',
        value: 120000,
        status: 'In Progress',
        stage: 'Proposal',
        probability: 60,
        expectedCloseDate: new Date('2024-06-01'),
        customerId: customers[3].id,
        userId: adminUser.id,
      },
    }),
    prisma.deal.create({
      data: {
        title: 'Annual Support Contract',
        value: 25000,
        status: 'Won',
        stage: 'Closed Won',
        probability: 100,
        expectedCloseDate: new Date('2024-02-28'),
        customerId: customers[4].id,
        userId: managerUser.id,
      },
    }),
  ]);

  console.log(`✅ Created ${deals.length} deals`);

  // ========== CREATE ACTIVITIES ==========
  console.log('📅 Creating activities...');
  
  const activities = await prisma.activity.createMany({
    data: [
      {
        type: 'Call',
        description: 'Initial discovery call with John Smith',
        date: new Date('2024-02-01'),
        dealId: deals[0].id,
        userId: adminUser.id,
      },
      {
        type: 'Meeting',
        description: 'Product demo for Tech Innovations team',
        date: new Date('2024-03-01'),
        dealId: deals[1].id,
        userId: managerUser.id,
      },
      {
        type: 'Email',
        description: 'Sent proposal for consulting services',
        date: new Date('2024-03-10'),
        dealId: deals[2].id,
        userId: regularUser.id,
      },
      {
        type: 'Meeting',
        description: 'Requirements gathering session',
        date: new Date('2024-03-20'),
        dealId: deals[3].id,
        userId: adminUser.id,
      },
      {
        type: 'Call',
        description: 'Contract renewal discussion',
        date: new Date('2024-02-15'),
        dealId: deals[4].id,
        userId: managerUser.id,
      },
    ],
  });

  console.log(`✅ Created ${activities.count} activities`);

  // ========== CREATE INVOICES ==========
  console.log('💰 Creating invoices...');
  
  const invoices = await Promise.all([
    prisma.invoice.create({
      data: {
        invoiceNumber: 'INV-2024-0001',
        customerId: customers[0].id,
        dealId: deals[0].id,
        issueDate: new Date('2024-03-01'),
        dueDate: new Date('2024-04-01'),
        subtotal: 50000,
        taxRate: 0.08,
        taxAmount: 4000,
        discountAmount: 0,
        totalAmount: 54000,
        amountPaid: 54000,
        amountDue: 0,
        status: 'Paid',
        notes: 'Payment for Enterprise Software License',
        termsConditions: 'Net 30 days. Late payments subject to 1.5% monthly interest.',
        items: {
          create: [
            {
              description: 'Enterprise Software License - Annual',
              quantity: 1,
              unitPrice: 50000,
              amount: 50000,
            },
          ],
        },
      },
    }),
    prisma.invoice.create({
      data: {
        invoiceNumber: 'INV-2024-0002',
        customerId: customers[1].id,
        dealId: deals[1].id,
        issueDate: new Date('2024-03-15'),
        dueDate: new Date('2024-04-15'),
        subtotal: 75000,
        taxRate: 0.08,
        taxAmount: 6000,
        discountAmount: 1000,
        totalAmount: 80000,
        amountPaid: 40000,
        amountDue: 40000,
        status: 'Sent',
        notes: 'Cloud Infrastructure Setup - Phase 1',
        termsConditions: 'Payment terms: 50% upfront, 50% upon completion.',
        items: {
          create: [
            {
              description: 'Cloud Infrastructure - Setup & Configuration',
              quantity: 1,
              unitPrice: 75000,
              amount: 75000,
            },
          ],
        },
      },
    }),
    prisma.invoice.create({
      data: {
        invoiceNumber: 'INV-2024-0003',
        customerId: customers[2].id,
        dealId: deals[2].id,
        issueDate: new Date('2024-03-20'),
        dueDate: new Date('2024-04-20'),
        subtotal: 30000,
        taxRate: 0.08,
        taxAmount: 2400,
        discountAmount: 500,
        totalAmount: 31900,
        amountPaid: 0,
        amountDue: 31900,
        status: 'Draft',
        notes: 'Consulting Services Package - Q2 2024',
        items: {
          create: [
            {
              description: 'Business Consulting - 100 hours',
              quantity: 100,
              unitPrice: 300,
              amount: 30000,
            },
          ],
        },
      },
    }),
    prisma.invoice.create({
      data: {
        invoiceNumber: 'INV-2024-0004',
        customerId: customers[4].id,
        dealId: deals[4].id,
        issueDate: new Date('2024-02-20'),
        dueDate: new Date('2024-03-20'),
        subtotal: 25000,
        taxRate: 0.08,
        taxAmount: 2000,
        discountAmount: 0,
        totalAmount: 27000,
        amountPaid: 27000,
        amountDue: 0,
        status: 'Paid',
        notes: 'Annual Support Contract Renewal',
        items: {
          create: [
            {
              description: 'Premium Support - Annual Contract',
              quantity: 1,
              unitPrice: 25000,
              amount: 25000,
            },
          ],
        },
      },
    }),
  ]);

  console.log(`✅ Created ${invoices.length} invoices`);

  // ========== CREATE PAYMENTS ==========
  console.log('💳 Creating payments...');
  
  const payments = await Promise.all([
    prisma.payment.create({
      data: {
        paymentNumber: 'PAY-2024-0001',
        invoiceId: invoices[0].id,
        customerId: customers[0].id,
        amount: 54000,
        paymentMethod: 'Credit Card',
        paymentDate: new Date('2024-03-05'),
        status: 'Completed',
        transactionId: 'TXN-1234567890',
        referenceNumber: 'REF-001',
        processedBy: 'Admin User',
        cardLast4: '4242',
        cardBrand: 'Visa',
        notes: 'Full payment for invoice INV-2024-0001',
      },
    }),
    prisma.payment.create({
      data: {
        paymentNumber: 'PAY-2024-0002',
        invoiceId: invoices[1].id,
        customerId: customers[1].id,
        amount: 40000,
        paymentMethod: 'Bank Transfer',
        paymentDate: new Date('2024-03-20'),
        status: 'Completed',
        transactionId: 'TXN-0987654321',
        referenceNumber: 'WIRE-002',
        processedBy: 'Manager User',
        bankName: 'Chase Bank',
        accountLast4: '5678',
        notes: 'Partial payment (50%) for invoice INV-2024-0002',
      },
    }),
    prisma.payment.create({
      data: {
        paymentNumber: 'PAY-2024-0003',
        invoiceId: invoices[3].id,
        customerId: customers[4].id,
        amount: 27000,
        paymentMethod: 'Check',
        paymentDate: new Date('2024-03-10'),
        status: 'Completed',
        transactionId: 'CHK-45678',
        referenceNumber: 'CHECK-003',
        processedBy: 'Admin User',
        notes: 'Check payment for annual support contract',
      },
    }),
  ]);

  console.log(`✅ Created ${payments.length} payments`);

  // ========== CREATE PAYMENT HISTORY ==========
  console.log('📜 Creating payment history...');
  
  const paymentHistory = await prisma.paymentHistory.createMany({
    data: [
      {
        paymentId: payments[0].id,
        action: 'Created',
        description: 'Payment created and processed',
        performedBy: 'Admin User',
      },
      {
        paymentId: payments[0].id,
        action: 'Completed',
        description: 'Payment successfully completed',
        performedBy: 'System',
      },
      {
        paymentId: payments[1].id,
        action: 'Created',
        description: 'Payment created',
        performedBy: 'Manager User',
      },
      {
        paymentId: payments[1].id,
        action: 'Verified',
        description: 'Bank transfer verified',
        performedBy: 'System',
      },
    ],
  });

  console.log(`✅ Created ${paymentHistory.count} payment history records`);

  // ========== CREATE REFUNDS ==========
  console.log('🔄 Creating refunds...');
  
  const refunds = await prisma.refund.createMany({
    data: [
      {
        refundNumber: 'REF-2024-0001',
        paymentId: payments[0].id,
        invoiceId: invoices[0].id,
        amount: 5000,
        reason: 'Service credit - Performance issues in first month',
        refundMethod: 'Credit Card',
        status: 'Completed',
        requestedAt: new Date('2024-03-25'),
        requestedBy: 'John Smith',
        approvedAt: new Date('2024-03-26'),
        approvedBy: 'Admin User',
        processedAt: new Date('2024-03-27'),
        processedBy: 'Admin User',
        transactionId: 'REFUND-TXN-001',
        notes: 'Approved partial refund for service disruption',
      },
    ],
  });

  console.log(`✅ Created ${refunds.count} refunds`);

  // ========== CREATE PAYMENT SETTINGS ==========
  console.log('⚙️ Creating payment settings...');
  
  await prisma.paymentSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      merchantName: 'CRM Pro Solutions',
      merchantEmail: 'billing@crmpro.com',
      defaultCurrency: 'USD',
      defaultTaxRate: 0.08,
      allowPartialPayment: true,
      autoSendReceipt: true,
    },
  });

  console.log('✅ Created payment settings');

  // ========== CREATE PAYMENT GATEWAYS ==========
  console.log('🔌 Creating payment gateways...');
  
  await prisma.paymentGateway.createMany({
    data: [
      {
        name: 'Stripe',
        apiKey: 'sk_test_demo_key_stripe',
        apiSecret: 'demo_secret_stripe',
        isActive: true,
      },
      {
        name: 'PayPal',
        apiKey: 'AYSq3RDGsmBLJIBnGHVFkHB8eJKFnBLJIBnGHVFkHB8',
        apiSecret: 'EHFnBLJIBnGHVFkHB8eJKFnB8eJKFnBLJI',
        isActive: true,
      },
    ],
  });

  console.log('✅ Created payment gateways');

  // ========== SUMMARY ==========
  console.log('\n🎉 ========== SEEDING COMPLETED SUCCESSFULLY ==========');
  console.log('📊 Summary:');
  console.log(`   - Users: 3 (admin, manager, user)`);
  console.log(`   - Customers: ${customers.length}`);
  console.log(`   - Contacts: ${contacts.count}`);
  console.log(`   - Deals: ${deals.length}`);
  console.log(`   - Activities: ${activities.count}`);
  console.log(`   - Invoices: ${invoices.length}`);
  console.log(`   - Payments: ${payments.length}`);
  console.log(`   - Payment History: ${paymentHistory.count}`);
  console.log(`   - Refunds: ${refunds.count}`);
  console.log(`   - Payment Settings: 1`);
  console.log(`   - Payment Gateways: 2`);
  console.log('\n🔑 Demo Login Credentials:');
  console.log('   Admin:   admin@crm.com / admin123');
  console.log('   Manager: manager@crm.com / manager123');
  console.log('   User:    user@crm.com / user123');
  console.log('=======================================================\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });