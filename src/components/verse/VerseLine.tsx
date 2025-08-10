import { Word } from "@/types/word";
import React from "react";

interface VerseLineProps {
  line: Word[];
}

const VerseLine = ({ line }: VerseLineProps) => {
  return (
    <div
      className="max-w-full justify-between flex items-start  mb-4"
      dir="rtl"
    >
      {line.map((word) => (
        <span key={word.id} className={`text-2xl  md:text-3xl lg:text-4x`}>
          {word.text_qpc_hafs}
        </span>
      ))}
    </div>
  );
};

export default VerseLine;
