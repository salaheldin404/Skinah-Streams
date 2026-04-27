interface TopInfoReadingBarProps {
  surahName: string;
  juzLabel: string;
  hizbLabel: string;
}
const TopInfoReadingBar = ({
  surahName,
  juzLabel,
  hizbLabel,
}: TopInfoReadingBarProps) => {
  return (
    <div className="sticky top-0 z-30 flex justify-between items-center px-4 sm:px-6 py-2 border-b border-border/30 bg-card/90 backdrop-blur-sm text-xs text-muted-foreground shrink-0">
      <div className="flex items-center gap-2">
        <span className="font-cairo font-semibold">{surahName}</span>
        <span className="font-cairo px-2 py-0.5 rounded-md bg-muted/50">
          {juzLabel}
        </span>
      </div>
      <span className="text-primary/80 font-semibold font-cairo px-2 py-0.5 rounded-md bg-primary/5">
        {hizbLabel}
      </span>
    </div>
  );
};

export default TopInfoReadingBar;
