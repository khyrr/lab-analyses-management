-- AlterTable
ALTER TABLE "AnalysisResult" ADD COLUMN     "isVoided" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "measuredAt" TIMESTAMP(3),
ADD COLUMN     "measuredBy" INTEGER,
ADD COLUMN     "voidReason" TEXT,
ADD COLUMN     "voidedAt" TIMESTAMP(3),
ADD COLUMN     "voidedBy" INTEGER,
ALTER COLUMN "value" DROP NOT NULL;
