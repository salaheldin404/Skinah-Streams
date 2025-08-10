import type { Reciter } from "@/types/reciter";
import ReciterCard from "./ReciterCard";
const RecitersList = ({ reciters }: { reciters: Reciter[] }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {reciters.map((reciter) => (
        <ReciterCard key={reciter.id} reciter={reciter} />
      ))}
    </div>
  );
};

export default RecitersList;
