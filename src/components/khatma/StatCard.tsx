interface StatCardProps {
  icon: React.ReactNode;
  label: React.ReactNode;
  value: React.ReactNode;
  bgColor: string;
  valueClassName?: string;
}

const StatCard = ({
  icon,
  label,
  value,
  bgColor,
  valueClassName,
}: StatCardProps) => (
  <div className="flex items-center gap-2">
    <div className={`p-2.5 rounded-full ${bgColor}`}>{icon}</div>
    <div className="min-w-0 text-center">
      <p className="text-xs text-muted-foreground mb-1">{label}</p>
      <p className={`text-lg font-bold truncate ${valueClassName ?? ""}`}>
        {value}
      </p>
    </div>
  </div>
);
export default StatCard;
