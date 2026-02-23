/*
  Warnings:

  - A unique constraint covering the columns `[settingsId,surahId,reciterId,mushafId]` on the table `PlayHistory` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "KhatmaPlan" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "pagesPerDay" INTEGER NOT NULL DEFAULT 20,
    "totalPages" INTEGER NOT NULL DEFAULT 604,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "targetEndDate" TIMESTAMP(3) NOT NULL,
    "currentPage" INTEGER NOT NULL DEFAULT 1,
    "completedPages" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isCompleted" BOOLEAN NOT NULL DEFAULT false,
    "completedAt" TIMESTAMP(3),
    "title" TEXT,
    "notes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KhatmaPlan_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "KhatmaPlan_userId_idx" ON "KhatmaPlan"("userId");

-- CreateIndex
CREATE INDEX "KhatmaPlan_userId_isActive_idx" ON "KhatmaPlan"("userId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "PlayHistory_settingsId_surahId_reciterId_mushafId_key" ON "PlayHistory"("settingsId", "surahId", "reciterId", "mushafId");

-- AddForeignKey
ALTER TABLE "KhatmaPlan" ADD CONSTRAINT "KhatmaPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
