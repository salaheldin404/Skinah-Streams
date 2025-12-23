import { formatTo12Hour, iconBgColors, iconTextColors } from "@/lib/utils/prayerTime";
import { PrayerName } from "@/types/paryerTime";
import { useTranslations } from "next-intl";
import { LuMoon, LuSun } from "react-icons/lu";



interface PrayerTimeCardProps {
  name: PrayerName;
  time: string;
}
const PrayerTimeCard = ({ name, time }: PrayerTimeCardProps) => {
    const t = useTranslations("PrayerTimes");
  
  const displayTime = formatTo12Hour(time);
  const Icon = ["Fajr", "Isha"].includes(name) ? LuMoon : LuSun;
  return (
    <div className="p-4 rounded-xl bg-card flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-full ${iconBgColors[name]}`}>
          <Icon className={`w-6 h-6 ${iconTextColors[name]}`} />
        </div>
        <div>
          <p className="font-semibold">{t(`prayerNames.${name}`)}</p>
        </div>
      </div>
      <div>
        <p className="font-mono font-semibold">{displayTime}</p>
      </div>
    </div>
  );
};

export default PrayerTimeCard;
