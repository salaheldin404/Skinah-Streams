/*
  Warnings:

  - You are about to drop the `Reciter` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Surah` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `PlayHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mushafName` to the `WishlistReciter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reciterImage` to the `WishlistReciter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reciterName` to the `WishlistReciter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `englishName` to the `WishlistSurah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `englishNameTranslation` to the `WishlistSurah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mushafName` to the `WishlistSurah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberOfAyahs` to the `WishlistSurah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reciterId` to the `WishlistSurah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reciterName` to the `WishlistSurah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `revelationType` to the `WishlistSurah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shortName` to the `WishlistSurah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surahName` to the `WishlistSurah` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `WishlistSurah` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PlayHistory" DROP CONSTRAINT "PlayHistory_reciterId_fkey";

-- DropForeignKey
ALTER TABLE "PlayHistory" DROP CONSTRAINT "PlayHistory_surahId_fkey";

-- DropForeignKey
ALTER TABLE "WishlistReciter" DROP CONSTRAINT "WishlistReciter_reciterId_fkey";

-- DropForeignKey
ALTER TABLE "WishlistSurah" DROP CONSTRAINT "WishlistSurah_surahId_fkey";

-- AlterTable
ALTER TABLE "PlayHistory" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "WishlistReciter" ADD COLUMN     "mushafId" INTEGER,
ADD COLUMN     "mushafName" TEXT NOT NULL,
ADD COLUMN     "reciterImage" TEXT NOT NULL,
ADD COLUMN     "reciterName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "WishlistSurah" ADD COLUMN     "englishName" TEXT NOT NULL,
ADD COLUMN     "englishNameTranslation" TEXT NOT NULL,
ADD COLUMN     "mushafName" TEXT NOT NULL,
ADD COLUMN     "numberOfAyahs" INTEGER NOT NULL,
ADD COLUMN     "reciterId" INTEGER NOT NULL,
ADD COLUMN     "reciterName" TEXT NOT NULL,
ADD COLUMN     "revelationType" TEXT NOT NULL,
ADD COLUMN     "shortName" TEXT NOT NULL,
ADD COLUMN     "surahName" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;

-- DropTable
DROP TABLE "Reciter";

-- DropTable
DROP TABLE "Surah";
