/*
  Warnings:

  - You are about to drop the column `generationId` on the `Document` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Document" DROP COLUMN "generationId";

-- AlterTable
ALTER TABLE "SMECompany" ADD COLUMN     "generationId" TEXT;
