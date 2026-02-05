"use client";
import { useEffect, useState } from "react";

const MainHeader = () => {
  const [hijriDate, setHijriDate] = useState("");

  useEffect(() => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      calendar: "islamic-umalqura",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    try {
      const date = new Intl.DateTimeFormat(
      "ar-SA-u-ca-islamic-umalqura",
        options
      ).format(today);
      setHijriDate(date);
    } catch (e) {
      console.error("Could not format Hijri date:", e);
      const fallbackDate = new Intl.DateTimeFormat("ar-EG-u-ca-islamic", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(today);
      setHijriDate(fallbackDate);
    }
  }, []);
  return (
    <header className="text-center mb-10 p-6 gradient-purple text-white rounded-xl shadow-lg relative overflow-hidden">
      <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
      <div className="absolute -bottom-8 -left-10 w-32 h-32 bg-white/10 rounded-lg transform rotate-45"></div>
      <div className="relative z-10">
        <p className="text-sm opacity-80 mb-2">{hijriDate}</p>
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
          حصن المسلم
        </h1>
        <p className="text-gray-100 mt-2 text-sm sm:text-base">
          رفيقك اليومي للأذكار والأدعية
        </p>
      </div>
    </header>
  );
};

export default MainHeader;
