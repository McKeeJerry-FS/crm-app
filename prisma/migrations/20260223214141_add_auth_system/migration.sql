/*
  Warnings:

  - You are about to drop the column `company` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Contact` table. All the data in the column will be lost.
  - You are about to drop the column `amount` on the `Deal` table. All the data in the column will be lost.
  - You are about to drop the column `contactId` on the `Deal` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Deal` table. All the data in the column will be lost.
  - You are about to drop the column `configuration` on the `PaymentGateway` table. All the data in the column will be lost.
  - You are about to drop the column `testMode` on the `PaymentGateway` table. All the data in the column will be lost.
  - You are about to drop the column `webhookUrl` on the `PaymentGateway` table. All the data in the column will be lost.
  - You are about to drop the column `metadata` on the `PaymentHistory` table. All the data in the column will be lost.
  - You are about to drop the column `allowPartialRefunds` on the `PaymentSettings` table. All the data in the column will be lost.
  - You are about to drop the column `allowStopPayments` on the `PaymentSettings` table. All the data in the column will be lost.
  - You are about to drop the column `autoApproveRefunds` on the `PaymentSettings` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `PaymentSettings` table. All the data in the column will be lost.
  - You are about to drop the column `defaultPaymentMethod` on the `PaymentSettings` table. All the data in the column will be lost.
  - You are about to drop the column `invoicePrefix` on the `PaymentSettings` table. All the data in the column will be lost.
  - You are about to drop the column `maxRefundAmount` on the `PaymentSettings` table. All the data in the column will be lost.
  - You are about to drop the column `paymentPrefix` on the `PaymentSettings` table. All the data in the column will be lost.
  - You are about to drop the column `refundPrefix` on the `PaymentSettings` table. All the data in the column will be lost.
  - You are about to drop the column `requireApprovalAbove` on the `PaymentSettings` table. All the data in the column will be lost.
  - You are about to drop the column `taxRate` on the `PaymentSettings` table. All the data in the column will be lost.
  - Added the required column `firstName` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `Contact` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `InvoiceItem` table without a default value. This is not possible if the table is not empty.
  - Made the column `apiKey` on table `PaymentGateway` required. This step will fail if there are existing NULL values in that column.
  - Made the column `apiSecret` on table `PaymentGateway` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `merchantEmail` to the `PaymentSettings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `merchantName` to the `PaymentSettings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Deal" DROP CONSTRAINT "Deal_contactId_fkey";

-- DropForeignKey
ALTER TABLE "Invoice" DROP CONSTRAINT "Invoice_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_customerId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "Refund" DROP CONSTRAINT "Refund_invoiceId_fkey";

-- DropForeignKey
ALTER TABLE "Refund" DROP CONSTRAINT "Refund_paymentId_fkey";

-- DropIndex
DROP INDEX "Contact_email_key";

-- DropIndex
DROP INDEX "Customer_email_key";

-- AlterTable
ALTER TABLE "Contact" DROP COLUMN "company",
DROP COLUMN "name",
ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL,
ADD COLUMN     "position" TEXT,
ADD COLUMN     "userId" TEXT,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "city" TEXT,
ADD COLUMN     "company" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "state" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'Active',
ADD COLUMN     "userId" TEXT,
ADD COLUMN     "zipCode" TEXT,
ALTER COLUMN "email" DROP NOT NULL,
ALTER COLUMN "phone" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Deal" DROP COLUMN "amount",
DROP COLUMN "contactId",
DROP COLUMN "description",
ADD COLUMN     "expectedCloseDate" TIMESTAMP(3),
ADD COLUMN     "probability" INTEGER,
ADD COLUMN     "stage" TEXT,
ADD COLUMN     "userId" TEXT,
ALTER COLUMN "status" SET DEFAULT 'Open';

-- AlterTable
ALTER TABLE "Invoice" ADD COLUMN     "userId" TEXT,
ALTER COLUMN "issueDate" DROP DEFAULT,
ALTER COLUMN "status" SET DEFAULT 'Draft';

-- AlterTable
ALTER TABLE "InvoiceItem" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Payment" ADD COLUMN     "userId" TEXT,
ALTER COLUMN "paymentDate" DROP DEFAULT,
ALTER COLUMN "status" SET DEFAULT 'Pending';

-- AlterTable
ALTER TABLE "PaymentGateway" DROP COLUMN "configuration",
DROP COLUMN "testMode",
DROP COLUMN "webhookUrl",
ALTER COLUMN "apiKey" SET NOT NULL,
ALTER COLUMN "apiSecret" SET NOT NULL;

-- AlterTable
ALTER TABLE "PaymentHistory" DROP COLUMN "metadata";

-- AlterTable
ALTER TABLE "PaymentSettings" DROP COLUMN "allowPartialRefunds",
DROP COLUMN "allowStopPayments",
DROP COLUMN "autoApproveRefunds",
DROP COLUMN "currency",
DROP COLUMN "defaultPaymentMethod",
DROP COLUMN "invoicePrefix",
DROP COLUMN "maxRefundAmount",
DROP COLUMN "paymentPrefix",
DROP COLUMN "refundPrefix",
DROP COLUMN "requireApprovalAbove",
DROP COLUMN "taxRate",
ADD COLUMN     "allowPartialPayment" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "autoSendReceipt" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "defaultCurrency" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN     "defaultTaxRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "merchantEmail" TEXT NOT NULL,
ADD COLUMN     "merchantName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Refund" ALTER COLUMN "paymentId" DROP NOT NULL,
ALTER COLUMN "invoiceId" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'Pending';

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "password" TEXT NOT NULL,
    "image" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "dealId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Customer" ADD CONSTRAINT "Customer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Deal" ADD CONSTRAINT "Deal_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_dealId_fkey" FOREIGN KEY ("dealId") REFERENCES "Deal"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Refund" ADD CONSTRAINT "Refund_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Refund" ADD CONSTRAINT "Refund_invoiceId_fkey" FOREIGN KEY ("invoiceId") REFERENCES "Invoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;
