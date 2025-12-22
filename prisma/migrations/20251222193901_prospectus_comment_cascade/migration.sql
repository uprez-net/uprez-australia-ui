-- DropForeignKey
ALTER TABLE "Comments" DROP CONSTRAINT "Comments_prospectusId_fkey";

-- AddForeignKey
ALTER TABLE "Comments" ADD CONSTRAINT "Comments_prospectusId_fkey" FOREIGN KEY ("prospectusId") REFERENCES "ClientProspectus"("id") ON DELETE CASCADE ON UPDATE CASCADE;
