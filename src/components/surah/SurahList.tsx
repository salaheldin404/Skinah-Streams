import React from "react";
import SurahCard from "./SurahCard";

import { Surah } from "@/types/surah";
const SurahList = ({ surahs }: { surahs: Surah[] }) => {
  return (
    <div className="grid min-[370px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-6">
      {surahs.map((surah) => (
        <SurahCard surah={surah} key={surah.number} />
      ))}
    </div>
  );
};

export default SurahList;
