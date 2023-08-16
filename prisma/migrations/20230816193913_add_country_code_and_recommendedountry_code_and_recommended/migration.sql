-- AlterTable
ALTER TABLE "Trip" ADD COLUMN     "countryCode" TEXT,
ADD COLUMN     "recommended" BOOLEAN NOT NULL DEFAULT false;
