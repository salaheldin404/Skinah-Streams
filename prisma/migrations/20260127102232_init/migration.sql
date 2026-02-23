-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reciterId" INTEGER NOT NULL DEFAULT 7,
    "reciterName" TEXT NOT NULL DEFAULT 'مشاري راشد العفاسي',
    "volume" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "fontStyle" TEXT NOT NULL DEFAULT 'uthmani',
    "fontSize" INTEGER NOT NULL DEFAULT 3,
    "ayahNumberStyle" TEXT NOT NULL DEFAULT 'ayah-2',
    "lastReadSurahId" INTEGER,
    "lastReadAyah" INTEGER,
    "lastReadAt" TIMESTAMP(3),
    "lastPlayedSurahId" INTEGER,
    "lastPlayedAyah" INTEGER,
    "lastPlayedAt" TIMESTAMP(3),
    "athkarData" JSONB NOT NULL DEFAULT '{}',
    "athkarExpiration" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Surah" (
    "id" INTEGER NOT NULL,
    "nameArabic" TEXT NOT NULL,
    "nameEnglish" TEXT NOT NULL,
    "nameTranslation" TEXT NOT NULL,
    "numberOfAyahs" INTEGER NOT NULL,
    "shortName" TEXT NOT NULL,
    "revelationType" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Surah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reciter" (
    "id" INTEGER NOT NULL,
    "nameArabic" TEXT NOT NULL,
    "nameEnglish" TEXT NOT NULL,
    "style" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Reciter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WishlistSurah" (
    "id" TEXT NOT NULL,
    "surahId" INTEGER NOT NULL,
    "settingsId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WishlistSurah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WishlistReciter" (
    "id" TEXT NOT NULL,
    "reciterId" INTEGER NOT NULL,
    "settingsId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WishlistReciter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PlayHistory" (
    "id" TEXT NOT NULL,
    "settingsId" TEXT NOT NULL,
    "surahId" INTEGER NOT NULL,
    "ayahId" INTEGER NOT NULL,
    "reciterId" INTEGER NOT NULL,
    "duration" INTEGER,
    "playedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PlayHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_userId_key" ON "UserSettings"("userId");

-- CreateIndex
CREATE INDEX "UserSettings_userId_idx" ON "UserSettings"("userId");

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_idx" ON "Session"("userId");

-- CreateIndex
CREATE INDEX "Reciter_nameArabic_idx" ON "Reciter"("nameArabic");

-- CreateIndex
CREATE INDEX "Reciter_nameEnglish_idx" ON "Reciter"("nameEnglish");

-- CreateIndex
CREATE INDEX "WishlistSurah_settingsId_idx" ON "WishlistSurah"("settingsId");

-- CreateIndex
CREATE INDEX "WishlistSurah_surahId_idx" ON "WishlistSurah"("surahId");

-- CreateIndex
CREATE UNIQUE INDEX "WishlistSurah_settingsId_surahId_key" ON "WishlistSurah"("settingsId", "surahId");

-- CreateIndex
CREATE INDEX "WishlistReciter_settingsId_idx" ON "WishlistReciter"("settingsId");

-- CreateIndex
CREATE INDEX "WishlistReciter_reciterId_idx" ON "WishlistReciter"("reciterId");

-- CreateIndex
CREATE UNIQUE INDEX "WishlistReciter_settingsId_reciterId_key" ON "WishlistReciter"("settingsId", "reciterId");

-- CreateIndex
CREATE INDEX "PlayHistory_settingsId_playedAt_idx" ON "PlayHistory"("settingsId", "playedAt");

-- CreateIndex
CREATE INDEX "PlayHistory_settingsId_surahId_idx" ON "PlayHistory"("settingsId", "surahId");

-- CreateIndex
CREATE INDEX "PlayHistory_surahId_idx" ON "PlayHistory"("surahId");

-- CreateIndex
CREATE INDEX "PlayHistory_playedAt_idx" ON "PlayHistory"("playedAt");

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishlistSurah" ADD CONSTRAINT "WishlistSurah_surahId_fkey" FOREIGN KEY ("surahId") REFERENCES "Surah"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishlistSurah" ADD CONSTRAINT "WishlistSurah_settingsId_fkey" FOREIGN KEY ("settingsId") REFERENCES "UserSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishlistReciter" ADD CONSTRAINT "WishlistReciter_reciterId_fkey" FOREIGN KEY ("reciterId") REFERENCES "Reciter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishlistReciter" ADD CONSTRAINT "WishlistReciter_settingsId_fkey" FOREIGN KEY ("settingsId") REFERENCES "UserSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayHistory" ADD CONSTRAINT "PlayHistory_settingsId_fkey" FOREIGN KEY ("settingsId") REFERENCES "UserSettings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayHistory" ADD CONSTRAINT "PlayHistory_surahId_fkey" FOREIGN KEY ("surahId") REFERENCES "Surah"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayHistory" ADD CONSTRAINT "PlayHistory_reciterId_fkey" FOREIGN KEY ("reciterId") REFERENCES "Reciter"("id") ON DELETE CASCADE ON UPDATE CASCADE;
