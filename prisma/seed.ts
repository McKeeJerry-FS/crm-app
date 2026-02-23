import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Clear existing data in correct order (respecting foreign key constraints)
  await prisma.paymentHistory.deleteMany();
  await prisma.refund.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.invoiceItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.deal.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.paymentGateway.deleteMany();
  await prisma.paymentSettings.deleteMany();

  console.log('Cleared existing data');

  // Seed Payment Settings
  const settings = await prisma.paymentSettings.create({
    data: {
      defaultPaymentMethod: 'Credit Card',
      autoApproveRefunds: false,
      maxRefundAmount: 10000,
      requireApprovalAbove: 5000,
      allowPartialRefunds: true,
      allowStopPayments: true,
      taxRate: 0.08,
      currency: 'USD',
      invoicePrefix: 'INV-',
      paymentPrefix: 'PAY-',
      refundPrefix: 'REF-',
    },
  });

  console.log('Created payment settings');

  // Seed Payment Gateways
  const stripe = await prisma.paymentGateway.create({
    data: {
      name: 'Stripe',
      isActive: true,
      testMode: true,
      webhookUrl: 'https://example.com/webhooks/stripe',
    },
  });

  const paypal = await prisma.paymentGateway.create({
    data: {
      name: 'PayPal',
      isActive: true,
      testMode: true,
      webhookUrl: 'https://example.com/webhooks/paypal',
    },
  });

  console.log('Created payment gateways');

  // Seed Customers
  const customer1 = await prisma.customer.create({
    data: {
      name: 'Acme Corporation',
      email: 'billing@acmecorp.com',
      phone: '555-0101',
      address: '123 Business St, New York, NY 10001',
    },
  });

  const customer2 = await prisma.customer.create({
    data: {
      name: 'TechStart Inc',
      email: 'accounts@techstart.com',
      phone: '555-0102',
      address: '456 Innovation Ave, San Francisco, CA 94102',
    },
  });

  const customer3 = await prisma.customer.create({
    data: {
      name: 'Global Enterprises',
      email: 'finance@globalent.com',
      phone: '555-0103',
      address: '789 Corporate Blvd, Chicago, IL 60601',
    },
  });

  console.log('Created customers');

  // Seed Contacts
  const contact1 = await prisma.contact.create({
    data: {
      name: 'John Smith',
      email: 'john.smith@acmecorp.com',
      phone: '555-0201',
      company: 'Acme Corporation',
      customerId: customer1.id,
    },
  });

  const contact2 = await prisma.contact.create({
    data: {
      name: 'Sarah Johnson',
      email: 'sarah.j@techstart.com',
      phone: '555-0202',
      company: 'TechStart Inc',
      customerId: customer2.id,
    },
  });

  console.log('Created contacts');

  // Seed Deals
  const deal1 = await prisma.deal.create({
    data: {
      title: 'Enterprise Software License',
      description: 'Annual license for 50 users with premium support',
      value: 75000,
      amount: 75000,
      status: 'Won',
      customerId: customer1.id,
      contactId: contact1.id,
    },
  });

  const deal2 = await prisma.deal.create({
    data: {
      title: 'Website Development',
      description: 'Complete website redesign and development',
      value: 45000,
      amount: 45000,
      status: 'Won',
      customerId: customer2.id,
      contactId: contact2.id,
    },
  });

  console.log('Created deals');

  // Seed Invoice 1
  const invoice1 = await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-2024-001',
      customerId: customer1.id,
      dealId: deal1.id,
      issueDate: new Date('2024-01-15'),
      dueDate: new Date('2024-02-15'),
      subtotal: 75000,
      taxRate: 0.08,
      taxAmount: 6000,
      totalAmount: 81000,
      amountPaid: 81000,
      amountDue: 0,
      status: 'Paid',
      notes: 'Annual enterprise license',
      termsConditions: 'Payment due within 30 days',
    },
  });

  // Add items to invoice 1
  await prisma.invoiceItem.create({
    data: {
      invoiceId: invoice1.id,
      description: 'Enterprise Software License - 50 Users',
      quantity: 50,
      unitPrice: 1500,
      amount: 75000,
    },
  });

  // Seed Invoice 2
  const invoice2 = await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-2024-002',
      customerId: customer2.id,
      dealId: deal2.id,
      issueDate: new Date('2024-01-20'),
      dueDate: new Date('2024-02-20'),
      subtotal: 45000,
      taxRate: 0.08,
      taxAmount: 3600,
      totalAmount: 48600,
      amountPaid: 24300,
      amountDue: 24300,
      status: 'Paid',
      notes: 'Website development project - 50% deposit received',
    },
  });

  // Add items to invoice 2
  await prisma.invoiceItem.createMany({
    data: [
      {
        invoiceId: invoice2.id,
        description: 'Website Design',
        quantity: 1,
        unitPrice: 15000,
        amount: 15000,
      },
      {
        invoiceId: invoice2.id,
        description: 'Frontend Development',
        quantity: 1,
        unitPrice: 20000,
        amount: 20000,
      },
      {
        invoiceId: invoice2.id,
        description: 'Backend Development',
        quantity: 1,
        unitPrice: 10000,
        amount: 10000,
      },
    ],
  });

  // Seed Invoice 3
  const invoice3 = await prisma.invoice.create({
    data: {
      invoiceNumber: 'INV-2024-003',
      customerId: customer3.id,
      issueDate: new Date('2024-02-01'),
      dueDate: new Date('2024-03-01'),
      subtotal: 25000,
      taxRate: 0.08,
      taxAmount: 2000,
      totalAmount: 27000,
      amountPaid: 0,
      amountDue: 27000,
      status: 'Sent',
      notes: 'Consulting services',
    },
  });

  // Add items to invoice 3
  await prisma.invoiceItem.create({
    data: {
      invoiceId: invoice3.id,
      description: 'Strategic Consulting - 100 hours',
      quantity: 100,
      unitPrice: 250,
      amount: 25000,
    },
  });

  console.log('Created invoices with items');

  // Seed Payment 1
  const payment1 = await prisma.payment.create({
    data: {
      paymentNumber: 'PAY-2024-001',
      invoiceId: invoice1.id,
      customerId: customer1.id,
      amount: 81000,
      paymentMethod: 'Credit Card',
      paymentDate: new Date('2024-01-20'),
      status: 'Completed',
      transactionId: 'ch_3aBcD1234567890',
      cardLast4: '4242',
      cardBrand: 'Visa',
      cardExpiry: '12/25',
      processedBy: 'System Admin',
      notes: 'Payment for enterprise license',
    },
  });

  // Add payment history for payment 1
  await prisma.paymentHistory.createMany({
    data: [
      {
        paymentId: payment1.id,
        action: 'Created',
        description: 'Payment created',
        performedBy: 'System Admin',
      },
      {
        paymentId: payment1.id,
        action: 'Completed',
        description: 'Payment processed successfully via Stripe',
        performedBy: 'System',
      },
    ],
  });

  // Seed Payment 2
  const payment2 = await prisma.payment.create({
    data: {
      paymentNumber: 'PAY-2024-002',
      invoiceId: invoice2.id,
      customerId: customer2.id,
      amount: 24300,
      paymentMethod: 'Bank Transfer',
      paymentDate: new Date('2024-01-25'),
      status: 'Completed',
      referenceNumber: 'WIRE-20240125-001',
      bankName: 'Chase Bank',
      accountLast4: '8765',
      processedBy: 'Finance Team',
      notes: '50% deposit payment',
    },
  });

  // Add payment history for payment 2
  await prisma.paymentHistory.createMany({
    data: [
      {
        paymentId: payment2.id,
        action: 'Created',
        description: 'Payment created',
        performedBy: 'Finance Team',
      },
      {
        paymentId: payment2.id,
        action: 'Completed',
        description: 'Wire transfer confirmed',
        performedBy: 'Finance Team',
      },
    ],
  });

  // Seed Payment 3 (Stopped Payment)
  const payment3 = await prisma.payment.create({
    data: {
      paymentNumber: 'PAY-2024-003',
      invoiceId: invoice2.id,
      customerId: customer2.id,
      amount: 10000,
      paymentMethod: 'Check',
      paymentDate: new Date('2024-02-10'),
      status: 'Stopped',
      referenceNumber: 'CHK-1234',
      isStopped: true,
      stoppedAt: new Date('2024-02-12'),
      stoppedBy: 'Finance Manager',
      stopReason: 'Customer requested stop payment - duplicate payment issue',
      processedBy: 'Finance Team',
      notes: 'Check payment - STOPPED',
    },
  });

  // Add payment history for payment 3
  await prisma.paymentHistory.createMany({
    data: [
      {
        paymentId: payment3.id,
        action: 'Created',
        description: 'Check payment created',
        performedBy: 'Finance Team',
      },
      {
        paymentId: payment3.id,
        action: 'Stopped',
        description: 'Payment stopped due to duplicate payment issue',
        performedBy: 'Finance Manager',
      },
    ],
  });

  console.log('Created payments with history');

  // Seed Refund 1
  const refund1 = await prisma.refund.create({
    data: {
      refundNumber: 'REF-2024-001',
      paymentId: payment1.id,
      invoiceId: invoice1.id,
      amount: 5000,
      reason: 'Partial refund - reduced user count from 50 to 45',
      refundMethod: 'Original Payment Method',
      status: 'Completed',
      requestedBy: 'Customer Service',
      approvedBy: 'Finance Manager',
      processedBy: 'System Admin',
      requestedAt: new Date('2024-02-01'),
      approvedAt: new Date('2024-02-02'),
      processedAt: new Date('2024-02-03'),
      transactionId: 're_1AbCdEf1234567890',
      notes: 'Customer downgraded license count',
    },
  });

  // Seed Refund 2
  const refund2 = await prisma.refund.create({
    data: {
      refundNumber: 'REF-2024-002',
      paymentId: payment2.id,
      invoiceId: invoice2.id,
      amount: 2500,
      reason: 'Service quality issue - partial refund approved',
      refundMethod: 'Store Credit',
      status: 'Pending',
      requestedBy: 'Customer',
      requestedAt: new Date('2024-02-15'),
      notes: 'Awaiting approval from finance manager',
    },
  });

  console.log('Created refunds');

  console.log('✅ Seeding finished successfully!');
  console.log('\nSummary:');
  console.log('- 3 Customers');
  console.log('- 2 Contacts');
  console.log('- 2 Deals');
  console.log('- 3 Invoices with items');
  console.log('- 3 Payments with history');
  console.log('- 2 Refunds');
  console.log('- 2 Payment Gateways');
  console.log('- 1 Payment Settings');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });