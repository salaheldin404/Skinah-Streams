/*
  Warnings:

  - You are about to drop the column `ayahId` on the `PlayHistory` table. All the data in the column will be lost.
  - You are about to drop the column `duration` on the `PlayHistory` table. All the data in the column will be lost.
  - You are about to drop the column `playedAt` on the `PlayHistory` table. All the data in the column will be lost.
  - Added the required column `englishName` to the `PlayHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `englishNameTranslation` to the `PlayHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mushafId` to the `PlayHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `mushafName` to the `PlayHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `numberOfAyahs` to the `PlayHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reciterName` to the `PlayHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `revelationType` to the `PlayHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `shortName` to the `PlayHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `surahName` to the `PlayHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `PlayHistory` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "PlayHistory_playedAt_idx";

-- DropIndex
DROP INDEX "PlayHistory_settingsId_playedAt_idx";

-- AlterTable
ALTER TABLE "PlayHistory" DROP COLUMN "ayahId",
DROP COLUMN "duration",
DROP COLUMN "playedAt",
ADD COLUMN     "englishName" TEXT NOT NULL,
ADD COLUMN     "englishNameTranslation" TEXT NOT NULL,
ADD COLUMN     "mushafId" INTEGER NOT NULL,
ADD COLUMN     "mushafName" TEXT NOT NULL,
ADD COLUMN     "numberOfAyahs" INTEGER NOT NULL,
ADD COLUMN     "reciterName" TEXT NOT NULL,
ADD COLUMN     "revelationType" TEXT NOT NULL,
ADD COLUMN     "shortName" TEXT NOT NULL,
ADD COLUMN     "surahName" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "PlayHistory_settingsId_idx" ON "PlayHistory"("settingsId");
