-- CreateEnum
CREATE TYPE "BasicCheckStatus" AS ENUM ('Pending', 'Passed', 'Failed');

-- CreateEnum
CREATE TYPE "ClientAccountStatus" AS ENUM ('Invited', 'Active', 'Archived');

-- CreateEnum
CREATE TYPE "DocumentType" AS ENUM ('MoA', 'BalanceSheet', 'ITR', 'GST_Return');

-- CreateEnum
CREATE TYPE "EligibilityStatus" AS ENUM ('Pending', 'SME_Eligible', 'Mainboard_Eligible', 'Not_Eligible');

-- CreateEnum
CREATE TYPE "GenerationStatus" AS ENUM ('Idle', 'Processing', 'Completed', 'Failed');

-- CreateEnum
CREATE TYPE "IntermediaryType" AS ENUM ('MerchantBanker', 'CompanySecretary', 'Auditor', 'Other');

-- CreateEnum
CREATE TYPE "TeamMemberRole" AS ENUM ('Admin', 'Editor', 'Viewer');

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SME', 'Intermediary', 'TeamMember');

-- CreateTable
CREATE TABLE "ClientAccount" (
    "id" TEXT NOT NULL,
    "intermediaryId" TEXT,
    "smeProfileId" TEXT,
    "status" "ClientAccountStatus" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "latestBackendReportId" TEXT,
    "currentGenerationStatus" "GenerationStatus" NOT NULL DEFAULT 'Idle',

    CONSTRAINT "ClientAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClientTeamMember" (
    "id" TEXT NOT NULL,
    "clientAccountId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "TeamMemberRole" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ClientTeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" TEXT NOT NULL,
    "clientAccountId" TEXT NOT NULL,
    "uploadedById" TEXT NOT NULL,
    "documentType" "DocumentType" NOT NULL,
    "fileName" TEXT NOT NULL,
    "uploadThingKey" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "periodYear" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "basicCheckStatus" "BasicCheckStatus" NOT NULL,
    "basicCheckReason" TEXT,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntermediaryProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "firmName" TEXT NOT NULL,
    "type" "IntermediaryType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IntermediaryProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SMEProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
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
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SMEProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "UserRole" NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Document_uploadThingKey_key" ON "Document"("uploadThingKey");

-- CreateIndex
CREATE UNIQUE INDEX "IntermediaryProfile_userId_key" ON "IntermediaryProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "SMEProfile_userId_key" ON "SMEProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "ClientAccount" ADD CONSTRAINT "ClientAccount_intermediaryId_fkey" FOREIGN KEY ("intermediaryId") REFERENCES "IntermediaryProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientAccount" ADD CONSTRAINT "ClientAccount_smeProfileId_fkey" FOREIGN KEY ("smeProfileId") REFERENCES "SMEProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientTeamMember" ADD CONSTRAINT "ClientTeamMember_clientAccountId_fkey" FOREIGN KEY ("clientAccountId") REFERENCES "ClientAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClientTeamMember" ADD CONSTRAINT "ClientTeamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_clientAccountId_fkey" FOREIGN KEY ("clientAccountId") REFERENCES "ClientAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntermediaryProfile" ADD CONSTRAINT "IntermediaryProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SMEProfile" ADD CONSTRAINT "SMEProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
