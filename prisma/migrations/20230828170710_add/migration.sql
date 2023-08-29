/*
  Warnings:

  - Made the column `guests` on table `TripReservation` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "TripReservation" ALTER COLUMN "guests" SET NOT NULL,
ALTER COLUMN "guests" DROP DEFAULT;
