import hisnMuslimData from "@/data/hisn-muslim.json";
import MainHeader from "./_components/MainHeader";
import CategoryCard from "./_components/CategoryCard";
import { Hisn } from "@/types/hisn-muslim";

const HisnMuslimPage = () => {
  const data = Object.keys(hisnMuslimData);
  return (
    <div className="py-10">
      <div className="main-container">
        <MainHeader />

        <div className="grid min-[600px]:grid-cols-2 lg:grid-cols-4 gap-3">
          {data.map((item, index) => (
            <CategoryCard
              key={`category-${index}`}
              category={(hisnMuslimData as Record<string, Hisn>)[item]}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HisnMuslimPage;
