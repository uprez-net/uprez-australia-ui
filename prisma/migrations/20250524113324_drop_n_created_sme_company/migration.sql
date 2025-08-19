/*
  Warnings:

  - You are about to drop the column `cin` on the `SMEProfile` table. All the data in the column will be lost.
  - You are about to drop the column `eligibilityStatus` on the `SMEProfile` table. All the data in the column will be lost.
  - You are about to drop the column `gstin` on the `SMEProfile` table. All the data in the column will be lost.
  - You are about to drop the column `industrySector` on the `SMEProfile` table. All the data in the column will be lost.
  - You are about to drop the column `netWorth` on the `SMEProfile` table. All the data in the column will be lost.
  - You are about to drop the column `paidUpCapital` on the `SMEProfile` table. All the data in the column will be lost.
  - You are about to drop the column `pan` on the `SMEProfile` table. All the data in the column will be lost.
  - You are about to drop the column `tan` on the `SMEProfile` table. All the data in the column will be lost.
  - You are about to drop the column `turnover` on the `SMEProfile` table. All the data in the column will be lost.
  - You are about to drop the column `yearsOperational` on the `SMEProfile` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ComplianceStatus" AS ENUM ('low', 'medium', 'high');

-- AlterTable
ALTER TABLE "SMEProfile" DROP COLUMN "cin",
DROP COLUMN "eligibilityStatus",
DROP COLUMN "gstin",
DROP COLUMN "industrySector",
DROP COLUMN "netWorth",
DROP COLUMN "paidUpCapital",
DROP COLUMN "pan",
DROP COLUMN "tan",
DROP COLUMN "turnover",
DROP COLUMN "yearsOperational";

-- CreateTable
CREATE TABLE "SMECompany" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "cin" TEXT,
    "pan" TEXT,
    "tan" TEXT,
    "gstin" TEXT,
    "paidUpCapital" DOUBLE PRECISION,
    "turnover" DOUBLE PRECISION,
    "netWorth" DOUBLE PRECISION,
    "yearsOperational" INTEGER,
    "industrySector" TEXT,
    "eligibilityStatus" "EligibilityStatus" NOT NULL,
    "complianceStatus" "ComplianceStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "smeProfileId" TEXT,
    "intermediaryId" TEXT,

    CONSTRAINT "SMECompany_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "SMECompany" ADD CONSTRAINT "SMECompany_smeProfileId_fkey" FOREIGN KEY ("smeProfileId") REFERENCES "SMEProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SMECompany" ADD CONSTRAINT "SMECompany_intermediaryId_fkey" FOREIGN KEY ("intermediaryId") REFERENCES "IntermediaryProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;
