/*
  Warnings:

  - A unique constraint covering the columns `[userId,isActive]` on the table `KhatmaPlan` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "KhatmaPlan" ADD COLUMN     "pausedAt" TIMESTAMP(3),
ADD COLUMN     "totalPausedDays" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE UNIQUE INDEX "KhatmaPlan_userId_isActive_key" ON "KhatmaPlan"("userId", "isActive");
