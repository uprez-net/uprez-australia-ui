/*
  Warnings:

  - You are about to drop the column `inputDocumentUrls` on the `IPOValuation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "IPOValuation" DROP COLUMN "inputDocumentUrls",
ALTER COLUMN "inputJson" DROP NOT NULL,
ALTER COLUMN "outputJson" DROP NOT NULL,
ALTER COLUMN "projectedNetProfit" DROP NOT NULL,
ALTER COLUMN "companyNarrativeAndGrowthStrategy" DROP NOT NULL,
ALTER COLUMN "keyBusinessRisks" DROP NOT NULL,
ALTER COLUMN "competitors" DROP NOT NULL,
ALTER COLUMN "ipoValuationPdfUrl" DROP NOT NULL;
