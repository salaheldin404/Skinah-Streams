-- DropIndex
DROP INDEX "KhatmaPlan_userId_isActive_key";

-- AlterTable
ALTER TABLE "KhatmaPlan" ADD COLUMN     "bookMarkIndex" INTEGER;
