/*
  Warnings:

  - The values [MoA,ITR,GST_Return] on the enum `DocumentType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `clientAccountId` on the `Document` table. All the data in the column will be lost.
  - Added the required column `smeCompanyId` to the `Document` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "DocumentType_new" AS ENUM ('AuditedFinancialStatements', 'BalanceSheet', 'ProfitAndLossStatement', 'CashFlowStatement', 'AnnualReport', 'TaxReturns', 'ManagementDiscussionAndAnalysis', 'CertificateOfIncorporation', 'MemorandumOfAssociation', 'ArticlesOfAssociation', 'BoardResolutions', 'ShareholderAgreements', 'MaterialContracts', 'IntellectualPropertyDocuments', 'ROCFilings', 'TaxComplianceCertificates', 'GSTReturns', 'EnvironmentalClearances', 'LaborComplianceCertificates', 'RegulatoryApprovals', 'StatutoryAuditReports', 'BoardMeetingMinutes', 'AuditCommitteeMinutes', 'CodeOfConduct', 'WhistleblowerPolicy', 'RelatedPartyTransactionPolicy', 'RiskManagementPolicy', 'NominationCommitteeMinutes');
ALTER TABLE "Document" ALTER COLUMN "documentType" TYPE "DocumentType_new" USING ("documentType"::text::"DocumentType_new");
ALTER TYPE "DocumentType" RENAME TO "DocumentType_old";
ALTER TYPE "DocumentType_new" RENAME TO "DocumentType";
DROP TYPE "DocumentType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Document" DROP CONSTRAINT "Document_clientAccountId_fkey";

-- AlterTable
ALTER TABLE "Document" DROP COLUMN "clientAccountId",
ADD COLUMN     "smeCompanyId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_smeCompanyId_fkey" FOREIGN KEY ("smeCompanyId") REFERENCES "SMECompany"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
