/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updated_at` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "email" TEXT NOT NULL,
ADD COLUMN "name" TEXT NOT NULL,
ADD COLUMN "updated_at" TIMESTAMP(3) NOT NULL,
ADD COLUMN "password" TEXT, 
ADD COLUMN "admin" BOOLEAN DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
