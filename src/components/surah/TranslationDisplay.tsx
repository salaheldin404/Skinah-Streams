import { Verse } from "@/types/verse";
import VerseAction from "../verse/VerseAction";
import { useEffect, useMemo, useRef } from "react";
import { useFont } from "@/hooks/useFont";

interface TranslationDisplayProps {
  verse: Verse;
  isHighlighted: boolean;
  handleClickVerse: (verse: Verse) => void;
  handleClickCopy: (verse: Verse) => void;
  isReciterDisabled: boolean;
  scrollId?: string;
}
const TranslationDisplay = ({
  verse,
  isHighlighted,
  handleClickVerse,
  handleClickCopy,
  isReciterDisabled,
  scrollId,
}: TranslationDisplayProps) => {
  const { fontFamily, fontSize, ayahNumberStyle } = useFont();
  const verseRef = useRef<HTMLDivElement>(null);
  const { text, number } = useMemo(() => {
    const verseText = verse.qpc_uthmani_hafs;
    const match = verseText.match(/^(.*?)(\s*[\d\u0660-\u0669]+)$/);
    if (!match) {
      return { text: verseText, number: "", splText: [verseText] };
    }
    return {
      text: match[1],
      number: match[2].trim(),
    };
  }, [verse.qpc_uthmani_hafs]);
  useEffect(() => {
    if (isHighlighted && verseRef.current) {
      verseRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [isHighlighted]);
  return (
    <div
      className={`flex px-2 md:px-4 gap-4 pb-2 ${
        isHighlighted && "bg-secondary"
      }`}
      key={verse.verse_key}
      ref={verseRef}
      id={scrollId}
    >
      <div className="flex-1 space-y-3">
        <p className={` ${fontFamily} ${fontSize} leading-normal`}>
          {text}
          <span className={`${ayahNumberStyle} mr-1`}>{number}</span>
        </p>
        {verse?.translations?.map((translation) => (
          <div key={translation.id} className=" font-cairo" dir="ltr">
            <p>{translation.text}</p>
            <span className="text-gray-500">{translation.resource_name}</span>
          </div>
        ))}
      </div>
      <VerseAction
        onClickCopy={handleClickCopy}
        isReciterDisabled={isReciterDisabled}
        verse={verse}
        onClickVerse={handleClickVerse}
        className="flex-col text-gray-500"
      />
    </div>
  );
};

export default TranslationDisplay;
