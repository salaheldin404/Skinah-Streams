/*
  Warnings:

  - You are about to drop the column `lastPlayedAyah` on the `UserSettings` table. All the data in the column will be lost.
  - You are about to drop the column `lastReadAyah` on the `UserSettings` table. All the data in the column will be lost.
  - You are about to drop the column `lastReadSurahId` on the `UserSettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserSettings" DROP COLUMN "lastPlayedAyah",
DROP COLUMN "lastReadAyah",
DROP COLUMN "lastReadSurahId",
ADD COLUMN     "lastRead" JSONB;
