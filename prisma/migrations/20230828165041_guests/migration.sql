/*
  Warnings:

  - Added the required column `guests` to the `TripReservation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TripReservation" ADD COLUMN     "guests" INT DEFAULT 0;
