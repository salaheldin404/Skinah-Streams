import SurahCard from "./SurahCard";

const CARD_HEIGHT = 116; // The fixed height of your SurahCard component.
const GAP_Y = 24; // The desired vertical gap between cards (e.g., Tailwind's gap-6).
const GAP_X = 24; // The desired horizontal gap between cards.

const SurahGridCell = ({ columnIndex, rowIndex, style, data }) => {
  const { surahs, columnCount } = data;
  const index = rowIndex * columnCount + columnIndex;
  const surah = surahs[index];

  // Don't render anything for cells that are out of bounds of the data array
  if (!surah) {
    return null;
  }

  // The style prop from react-window MUST be applied to the outer div.
  // The inner div is used to re-create the "gap" from the original grid layout.
  return (
    <div style={style}>
      <div className="p-2 md:p-4">
        <SurahCard surah={surah} />
      </div>
    </div>
  );
};
export default SurahGridCell;
