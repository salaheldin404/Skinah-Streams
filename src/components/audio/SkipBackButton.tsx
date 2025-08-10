import { memo } from "react";
import { Button } from "@/components/ui/button";
import { LuSkipBack } from "react-icons/lu";
const SkipBackButton = memo(() => {
  return (
    <Button
      variant="secondary"
      className="cursor-pointer w-8 h-8 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
    >
      <LuSkipBack className="w-5 h-5" />
    </Button>
  );
});

SkipBackButton.displayName = "SkipBackButton";

export default SkipBackButton;
