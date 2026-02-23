"use client";

import React, { useState, useCallback, useEffect, useMemo } from "react";
import { Copy, Check, RefreshCw, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
// import {
//   WhatsappShareButton,
//   WhatsappIcon,
//   TelegramShareButton,
//   TelegramIcon,
// } from "react-share";
import RandomAyahSkeleton from "./quickAccess/loading/RandomAyahSkeleton";

/* ───────────────────────── mock data ───────────────────────── */
const AYAHS = [
  {
    surah: "Al-Baqarah",
    surahArabic: "البقرة",
    surahNumber: 2,
    number: 286,
    arabic: "لَا يُكَلِّفُ ٱللَّهُ نَفْسًا إِلَّا وُسْعَهَا ۚ  ۗ",
    translation: "Allah does not burden a soul beyond that it can bear.",
  },
  {
    surah: "Ar-Ra'd",
    surahArabic: "الرعد",
    surahNumber: 13,
    number: 28,
    arabic: "أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ",
    translation: "Surely in the remembrance of Allah do hearts find comfort.",
  },
  {
    surah: "Ash-Sharh",
    surahArabic: "الشرح",
    surahNumber: 94,
    number: 6,
    arabic: "إِنَّ مَعَ ٱلْعُسْرِ يُسْرًا",
    translation: "Indeed, with hardship [will be] ease.",
  },
  {
    surah: "Az-Zumar",
    surahArabic: "الزمر",
    surahNumber: 39,
    number: 53,
    arabic:
      "قُلْ يَـٰعِبَادِىَ ٱلَّذِينَ أَسْرَفُوا۟ عَلَىٰٓ أَنفُسِهِمْ لَا تَقْنَطُوا۟ مِن رَّحْمَةِ ٱللَّهِ ۚ ",
    translation:
      "Say, ˹O Prophet, that Allah says,˺ “O My servants who have exceeded the limits against their souls! Do not lose hope in Allah’s mercy",
  },
  {
    surah: "At-Talaq",
    surahArabic: "الطلاق",
    surahNumber: 65,
    number: 3,
    arabic: "وَمَن يَتَوَكَّلْ عَلَى ٱللَّهِ فَهُوَ حَسْبُهُۥ",
    translation: "God will be enough for those who put their trust in Him.",
  },
  {
    surah: "Al-Baqarah",
    surahArabic: "البقرة",
    surahNumber: 2,
    number: 152,
    arabic: "فَٱذۡكُرُونِيٓ أَذۡكُرۡكُمۡ وَٱشۡكُرُواْ لِي وَلَا تَكۡفُرُونِ",
    translation:
      "So remember Me; I will remember you. Be thankful to Me, and never ungrateful.",
  },
  {
    surah: "Al-Anfal",
    surahArabic: "الأنفال",
    surahNumber: 8,
    number: 46,
    arabic: "وَٱصْبِرُوٓا۟ ۚ إِنَّ ٱللَّهَ مَعَ ٱلصَّـٰبِرِينَ",
    translation: "Be steadfast: God is with the steadfast.",
  },
  {
    surah: "Taha",
    surahArabic: "طه",
    surahNumber: 20,
    number: 46,
    arabic: "قَالَ لَا تَخَافَآ ۖ إِنَّنِى مَعَكُمَآ أَسْمَعُ وَأَرَىٰ",
    translation:
      "He said, ‘Do not be afraid, I am with you both, hearing and seeing everything.",
  },
  {
    surah: "An-Nahl",
    surahArabic: "النحل",
    surahNumber: 16,
    number: 97,
    arabic:
      "مَنْ عَمِلَ صَـٰلِحًۭا مِّن ذَكَرٍ أَوْ أُنثَىٰ وَهُوَ مُؤْمِنٌۭ فَلَنُحْيِيَنَّهُۥ حَيَوٰةًۭ طَيِّبَةًۭ ۖ وَلَنَجْزِيَنَّهُمْ أَجْرَهُم بِأَحْسَنِ مَا كَانُوا۟ يَعْمَلُونَ",
    translation:
      "Whoever does good, whether male or female, and is a believer, We will surely bless them with a good life, and We will certainly reward them according to the best of their deeds.",
  },
  {
    surah: "Al-Hashr",
    surahArabic: "الحشر",
    surahNumber: 59,
    number: 22,
    arabic:
      "هُوَ ٱللَّهُ ٱلَّذِى لَآ إِلَـٰهَ إِلَّا هُوَ ۖ عَـٰلِمُ ٱلْغَيْبِ وَٱلشَّهَـٰدَةِ ۖ هُوَ ٱلرَّحْمَـٰنُ ٱلرَّحِيمُ ٢٢",
    translation:
      "He is Allah—there is no god ˹worthy of worship˺ except Him: Knower of the seen and unseen. He is the Most Compassionate, Most Merciful.",
  },
  {
    surah: "Aal-i-Imran",
    surahArabic: "آل عمران",
    surahNumber: 3,
    number: 139,
    arabic:
      "وَلَا تَهِنُوا۟ وَلَا تَحْزَنُوا۟ وَأَنتُمُ ٱلْأَعْلَوْنَ إِن كُنتُم مُّؤْمِنِينَ",
    translation:
      "Do not falter or grieve, for you will have the upper hand, if you are ˹true˺ believers.",
  },
  {
    surah: "Ghafir",
    surahArabic: "غافر",
    surahNumber: 40,
    number: 60,
    arabic: "وَقَالَ رَبُّكُمُ ٱدْعُونِىٓ أَسْتَجِبْ لَكُمْ",
    translation:
      "Your Lord has proclaimed, “Call upon Me, I will respond to you.",
  },
  {
    surah: "Al-Baqarah",
    surahArabic: "البقرة",
    surahNumber: 2,
    number: 186,
    arabic:
      "وَإِذَا سَأَلَكَ عِبَادِى عَنِّى فَإِنِّى قَرِيبٌ ۖ أُجِيبُ دَعْوَةَ ٱلدَّاعِ إِذَا دَعَانِ ۖ ",
    translation:
      "[Prophet], if My servants ask you about Me, I am near. I respond to those who call Me",
  },
  {
    surah: "Yusuf",
    surahArabic: "يوسف",
    surahNumber: 12,
    number: 86,
    arabic:
      "قَالَ إِنَّمَآ أَشْكُوا۟ بَثِّى وَحُزْنِىٓ إِلَى ٱللَّهِ وَأَعْلَمُ مِنَ ٱللَّهِ مَا لَا تَعْلَمُونَ ",
    translation:
     "He replied, “I complain of my anguish and sorrow only to Allah, and I know from Allah what you do not know."
  },
  {
    surah: "Ar-Rahman",
    surahArabic: "الرحمن",
    surahNumber: 55,
    number: 60,
    arabic: "هَلْ جَزَآءُ ٱلْإِحْسَـٰنِ إِلَّا ٱلْإِحْسَـٰنُ",
    translation: "Is there any reward for goodness except goodness?",
  },
  {
    surah: "Ad-Duhaa",
    surahArabic: "الضحى",
    surahNumber: 93,
    number: 3,
    arabic: "مَا وَدَّعَكَ رَبُّكَ وَمَا قَلَىٰ",
    translation:
    "Your Lord ˹O Prophet˺ has not abandoned you, nor has He become hateful ˹of you˺."
  },
  {
    surah: "Taha",
    surahArabic: "طه",
    surahNumber: 20,
    number: 114,
    arabic: "وَقُل رَّبِّ زِدْنِى عِلْمًا",
    translation: "And say, 'My Lord, increase me in knowledge.'",
  },
];

/* ──────────────────────── helpers ──────────────────────── */
function pickRandom(current: number): number {
  let next: number;
  do {
    next = Math.floor(Math.random() * AYAHS.length);
  } while (next === current && AYAHS.length > 1);
  return next;
}

/* ──────────────────────── component ──────────────────────── */
export default function RandomAyah() {
  const [index, setIndex] = useState(() =>
    Math.floor(Math.random() * AYAHS.length),
  );
  const [animating, setAnimating] = useState(false);
  const [copied, setCopied] = useState(false);
  // const [showShareMenu, setShowShareMenu] = useState(false);
  const [isClient, setIsClient] = useState(false);
  // const [origin, setOrigin] = useState("");
  // const shareRef = useRef<HTMLDivElement>(null);

  const t = useTranslations("RandomAyah");

  const ayah = AYAHS[index];
  useEffect(() => {
    setIsClient(true);
  }, []);

  /* ── build share text ── */
  const textToCopy = useMemo(() => {
    const a = AYAHS[index];
    return `${a.arabic}\n\n${a.translation}\n\n— ${a.surahArabic} (${a.surah}) : ${a.number}`;
  }, [index]);

  /* ── copy using dynamic textarea (iframe-safe, zero-size safe) ── */
  const copyText = useCallback(() => {
    const el = document.createElement("textarea");
    el.value = textToCopy;
    el.style.cssText =
      "position:fixed;top:0;left:0;width:2em;height:2em;padding:0;border:none;outline:none;box-shadow:none;background:transparent;";
    document.body.appendChild(el);
    el.focus();
    el.select();
    try {
      document.execCommand("copy");
      setCopied(true);
    } catch {
      /* execCommand not supported */
    } finally {
      document.body.removeChild(el);
    }
  }, [textToCopy]);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(id);
  }, [copied]);

  /* ── capture origin client-side (SSR-safe) ── */
  // useEffect(() => {
  //   setOrigin(window.location.origin);
  // }, []);

  /* ── ayah-specific deep-link URL ── */
  // const ayahPath = `/surahs/${ayah.surahNumber}?verse=${ayah.number}`;
  // const ayahUrl = origin ? `${origin}${ayahPath}` : ayahPath;

  /* ── close share menu on outside click ── */
  // useEffect(() => {
  //   if (!showShareMenu) return;
  //   const handler = (e: MouseEvent) => {
  //     if (shareRef.current && !shareRef.current.contains(e.target as Node)) {
  //       setShowShareMenu(false);
  //     }
  //   };
  //   document.addEventListener("mousedown", handler);
  //   return () => document.removeEventListener("mousedown", handler);
  // }, [showShareMenu]);

  /* ── next ayah with animation ── */
  const nextAyah = useCallback(() => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setIndex((prev) => pickRandom(prev));
      setAnimating(false);
    }, 600);
  }, [animating]);

  if (!isClient) return <RandomAyahSkeleton />;
  return (
    <section className="py-10">
      <div className="main-container">
        <div className="relative overflow-hidden rounded-[2.5rem] bg-white/10 dark:bg-white/[0.04] backdrop-blur-2xl border border-white/20 dark:border-white/10 shadow-xl shadow-black/5 dark:shadow-black/20 p-8 ">
          {/* ── decorative orbs ── */}
          <div
            aria-hidden
            className="pointer-events-none bg-primary absolute -top-20 -left-20 h-64 w-64 rounded-full opacity-30 blur-[100px]"
          />
          <div
            aria-hidden
            className="pointer-events-none bg-primary absolute -bottom-20 -right-20 h-72 w-72 rounded-full opacity-25 blur-[120px]"
          />

          {/* ── header row ── */}
          <div className="relative z-10 flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold tracking-tight text-foreground">
                {t("title")}
              </h2>
            </div>

            <button
              onClick={nextAyah}
              aria-label="New random ayah"
              className="group cursor-pointer dark:text-white dark:bg-black/15 bg-primary/10 text-primary flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 hover:scale-[1.04] active:scale-95"
            >
              <RefreshCw
                className={`h-4 w-4 transition-transform duration-500 ${
                  animating ? "animate-spin" : "group-hover:rotate-180"
                }`}
              />
              <span className="hidden sm:inline">{t("new-ayah")}</span>
            </button>
          </div>

          {/* ── ayah content (animated) ── */}
          <div
            className="relative z-10 transition-all duration-[600ms] ease-in-out"
            style={{
              opacity: animating ? 0 : 1,
              filter: animating ? "blur(6px)" : "blur(0px)",
              transform: animating ? "translateY(12px)" : "translateY(0)",
            }}
          >
            {/* arabic text */}
            <p
              dir="rtl"
              lang="ar"
              className="almajeed-text  text-2xl md:text-4xl lg:text-[2.75rem] leading-[1.9] md:leading-[2] font-medium text-foreground text-right mb-6"
              // style={{ fontFamily: "'Amiri', 'Scheherazade New', serif" }}
            >
              {ayah.arabic}
            </p>

            {/* translation */}
            <div className="flex" dir="ltr">
              <div className="w-1 shrink-0 rounded-full mr-4 bg-primary" />
              <p className="text-base md:text-lg leading-relaxed text-muted-foreground italic">
                {ayah.translation}
              </p>
            </div>

            {/* surah reference */}
            {/* <Link
              href={`/surahs/${ayah.surahNumber}?verse=${ayah.number}`}
              dir="ltr"
              className="mt-5 block w-fit mr-auto text-primary text-sm font-medium transition-colors hover:underline underline-offset-4"
            >
              — {ayah.surahArabic} ({ayah.surah}) : {ayah.number}
            </Link> */}
            <div dir="ltr" className="mt-5  text-primary text-sm font-bold ">
              — {ayah.surahArabic} ({ayah.surah}) : {ayah.number}
            </div>
          </div>

          {/* ── action buttons ── */}
          <div className="relative z-10 mt-8 flex items-center gap-2">
            {/* copy */}
            <button
              onClick={copyText}
              aria-label="Copy ayah"
              className={`cursor-pointer ${copied ? "text-green-500 bg-green-500/10" : "text-primary dark:text-white bg-primary/12"} flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 active:scale-95`}
            >
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>

            {/* share */}
            {/*             
            <div ref={shareRef} className="relative">
              <button
                onClick={() => setShowShareMenu((prev) => !prev)}
                aria-label="Share ayah"
                className={`cursor-pointer ${showShareMenu ? "text-white bg-primary" : "text-primary dark:text-white bg-primary/12"} flex h-10 w-10 items-center justify-center rounded-full transition-all duration-200 hover:scale-110 active:scale-95`}
              >
                <Share2 className="h-4 w-4" />
              </button>

              {showShareMenu && (
                <div className="absolute bottom-12 left-0 z-50 flex gap-2 rounded-2xl border border-white/20 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-xl p-3 shadow-xl shadow-black/10">
                  <WhatsappShareButton
                    url={ayahUrl}
                    title={buildText()}
                    separator="\n\n"
                    onClick={() => setShowShareMenu(false)}
                  >
                    <WhatsappIcon size={36} round />
                  </WhatsappShareButton>

                  <TelegramShareButton
                    url={ayahUrl}
                    title={buildText()}
                    onClick={() => setShowShareMenu(false)}
                  >
                    <TelegramIcon size={36} round />
                  </TelegramShareButton>
                </div>
              )}
            </div>
             */}
          </div>
        </div>
      </div>
    </section>
  );
}
