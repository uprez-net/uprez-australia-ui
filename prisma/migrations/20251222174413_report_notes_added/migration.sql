-- CreateTable
CREATE TABLE "ReportUserNotes" (
    "id" TEXT NOT NULL,
    "documentId" TEXT NOT NULL,
    "generationId" TEXT NOT NULL,
    "generationNumber" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "expertVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReportUserNotes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ReportUserNotes" ADD CONSTRAINT "ReportUserNotes_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReportUserNotes" ADD CONSTRAINT "ReportUserNotes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
