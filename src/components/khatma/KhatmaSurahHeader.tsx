import {memo} from "react";
const KhatmaSurahHeader = memo(({
  surahName,
  showBismillah,
}: {
  surahName: string;
  showBismillah: boolean;
}) => {
  return (
    <div
      className="
  group relative my-4 sm:my-6 overflow-hidden 
 
  "
    >
      <div className="text-center bg-secondary rounded-md p-2">
        <h2
          className="text-xl sm:text-3xl font-sans font-bold
        "
        >
          {surahName}
        </h2>
      </div>
      {/* Bismillah */}
      {showBismillah && (
        <div className="max-w-full overflow-hidden text-center grid place-content-center mt-3">
          <p className="text-5xl mushaf-text">﷽</p>
        </div>
      )}
    </div>
  );
});

KhatmaSurahHeader.displayName = "KhatmaSurahHeader";

export default KhatmaSurahHeader;
