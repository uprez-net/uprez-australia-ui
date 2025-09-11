/*
  Warnings:

  - You are about to drop the column `cin` on the `SMECompany` table. All the data in the column will be lost.
  - You are about to drop the column `gstin` on the `SMECompany` table. All the data in the column will be lost.
  - You are about to drop the column `pan` on the `SMECompany` table. All the data in the column will be lost.
  - You are about to drop the column `tan` on the `SMECompany` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SMECompany" DROP COLUMN "cin",
DROP COLUMN "gstin",
DROP COLUMN "pan",
DROP COLUMN "tan",
ADD COLUMN     "abn" TEXT,
ADD COLUMN     "acn" TEXT,
ADD COLUMN     "asicRegistration" TEXT,
ADD COLUMN     "austracRegistered" BOOLEAN,
ADD COLUMN     "chessHin" TEXT,
ADD COLUMN     "companyType" TEXT,
ADD COLUMN     "gstEffectiveDate" TIMESTAMP(3),
ADD COLUMN     "gstRegistered" BOOLEAN,
ADD COLUMN     "incorporationDate" TIMESTAMP(3),
ADD COLUMN     "last3YearsRevenue" JSONB,
ADD COLUMN     "paygWithholding" BOOLEAN,
ADD COLUMN     "stateOfRegistration" TEXT;
