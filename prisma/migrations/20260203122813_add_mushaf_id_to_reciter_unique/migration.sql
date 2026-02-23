/*
  Warnings:

  - A unique constraint covering the columns `[settingsId,reciterId,mushafId]` on the table `WishlistReciter` will be added. If there are existing duplicate values, this will fail.
  - Made the column `mushafId` on table `WishlistReciter` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "WishlistReciter_settingsId_reciterId_key";

-- AlterTable
ALTER TABLE "WishlistReciter" ALTER COLUMN "mushafId" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "WishlistReciter_settingsId_reciterId_mushafId_key" ON "WishlistReciter"("settingsId", "reciterId", "mushafId");
