/*
  Warnings:

  - You are about to drop the column `capitalRaiseAmount` on the `IPOValuation` table. All the data in the column will be lost.
  - You are about to drop the column `companyNarrativeAndGrowthStrategy` on the `IPOValuation` table. All the data in the column will be lost.
  - You are about to drop the column `competitors` on the `IPOValuation` table. All the data in the column will be lost.
  - You are about to drop the column `keyBusinessRisks` on the `IPOValuation` table. All the data in the column will be lost.
  - You are about to drop the column `projectedNetProfit` on the `IPOValuation` table. All the data in the column will be lost.
  - You are about to drop the column `recommendedIpoPriceMin` on the `IPOValuation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "IPOValuation" DROP COLUMN "capitalRaiseAmount",
DROP COLUMN "companyNarrativeAndGrowthStrategy",
DROP COLUMN "competitors",
DROP COLUMN "keyBusinessRisks",
DROP COLUMN "projectedNetProfit",
DROP COLUMN "recommendedIpoPriceMin",
ADD COLUMN     "CurrentSharePrice" DOUBLE PRECISION,
ADD COLUMN     "ProposedTicker" TEXT,
ADD COLUMN     "ReportProcessing" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "Sector" TEXT,
ADD COLUMN     "SubSector" TEXT,
ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "growth_engine" TEXT,
ADD COLUMN     "team_edge" TEXT,
ADD COLUMN     "the_landscape" TEXT,
ADD COLUMN     "the_market" TEXT,
ADD COLUMN     "the_mission" TEXT,
ADD COLUMN     "the_moat" TEXT,
ADD COLUMN     "the_problem" TEXT,
ADD COLUMN     "the_solution" TEXT;
