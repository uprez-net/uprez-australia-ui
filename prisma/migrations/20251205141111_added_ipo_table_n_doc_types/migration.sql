-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "DocumentType" ADD VALUE 'CapitalisationTable';
ALTER TYPE "DocumentType" ADD VALUE 'InvestorPresentationPitchDeck';
ALTER TYPE "DocumentType" ADD VALUE 'FormalBusinessPlan';
ALTER TYPE "DocumentType" ADD VALUE 'InformationMemorandum';
ALTER TYPE "DocumentType" ADD VALUE 'InternalRiskRegister';
ALTER TYPE "DocumentType" ADD VALUE 'DueDiligenceQuestionnaire';
ALTER TYPE "DocumentType" ADD VALUE 'BoardMeetingMinutes';

-- CreateTable
CREATE TABLE "IPOValuation" (
    "id" TEXT NOT NULL,
    "generation_id" TEXT NOT NULL,
    "clientAccountId" TEXT NOT NULL,
    "inputJson" JSONB NOT NULL,
    "outputJson" JSONB NOT NULL,
    "projectedNetProfit" TEXT NOT NULL,
    "companyNarrativeAndGrowthStrategy" TEXT NOT NULL,
    "keyBusinessRisks" TEXT NOT NULL,
    "competitors" TEXT NOT NULL,
    "inputDocumentUrls" TEXT[],
    "ipoValuationPdfUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "IPOValuation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "IPOValuation" ADD CONSTRAINT "IPOValuation_clientAccountId_fkey" FOREIGN KEY ("clientAccountId") REFERENCES "SMECompany"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
