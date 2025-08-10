import { memo } from "react";
import { Button } from "@/components/ui/button";
import { LuSkipForward } from "react-icons/lu";
const SkipForwardButton = memo(() => {
  return (
    <Button
      variant="secondary"
      className="cursor-pointer w-8 h-8 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
    >
      <LuSkipForward className="w-5 h-5" />
    </Button>
  );
});

SkipForwardButton.displayName = "SkipForwardButton";

export default SkipForwardButton;
