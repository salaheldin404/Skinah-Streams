import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { LuHeart } from "react-icons/lu";
import { FaHeart } from "react-icons/fa";

interface WishlistButtonProps {
  handleToggle: () => void;
  isItemInWishlist: boolean;
  textContent: string;
}

const WishlistButton = ({
  handleToggle,
  isItemInWishlist,
  textContent,
}: WishlistButtonProps) => {
  return (
    <Tooltip>
      <TooltipTrigger
        onClick={handleToggle}
        className="cursor-pointer p-2 rounded-full text-gray-500 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-secondary transition-colors"
      >
        {isItemInWishlist ? (
          <FaHeart className="w-5 h-5 text-primary" />
        ) : (
          <LuHeart className="w-5 h-5" />
        )}
      </TooltipTrigger>
      <TooltipContent className="">{textContent}</TooltipContent>
    </Tooltip>
  );
};

export default WishlistButton;
