import ReciterCard from "@/components/reciter/ReciterCard";
import { ReciterWishlist } from "@/types/wishlist";

interface ReciterContentProps {
  reciters: ReciterWishlist[];
  reciterText: string;
}

const ReciterContent = ({ reciters, reciterText }: ReciterContentProps) => {
  if (reciters?.length === 0) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-bold">{reciterText}</h3>
      </div>
    );
  }
  return (
    <div className="grid min-[370px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
      {reciters?.map((reciter) => {
        const reciterData = {
          name: reciter.reciter_name,
          id: reciter.reciter_id,
          moshaf: [
            {
              id: reciter.mushaf_id,
              name: reciter.mushaf_name,
            },
          ],
        };
        return (
          <ReciterCard
            reciter={reciterData}
            key={`reciter-${reciter.reciter_id}`}
          />
        );
      })}
    </div>
  );
};

export default ReciterContent;
