/*
  Warnings:

  - A unique constraint covering the columns `[settingsId,surahId,mushafId]` on the table `WishlistSurah` will be added. If there are existing duplicate values, this will fail.
  - Made the column `mushafId` on table `WishlistSurah` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "WishlistSurah_settingsId_surahId_key";

-- AlterTable
ALTER TABLE "WishlistSurah" ALTER COLUMN "mushafId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "WishlistSurah_settingsId_surahId_mushafId_key" ON "WishlistSurah"("settingsId", "surahId", "mushafId");
