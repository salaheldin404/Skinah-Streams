"use client";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { setQuranFont } from "@/lib/store/slices/font-slice";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
const FontSelect = () => {
  const dispatch = useAppDispatch();
  const { quranFont } = useAppSelector((state) => state.font);

  const handleChangeStyle = (style: string) => {
    dispatch(
      setQuranFont({
        ...quranFont,
        style,
      })
    );
  };
  return (
    <Select value={quranFont.style} onValueChange={handleChangeStyle}>
      <SelectTrigger className="w-[70%] ">
        <SelectValue placeholder="Select a font style" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="uthmani">Uthmani </SelectItem>
          <SelectItem value="almushaf">Almushaf</SelectItem>
          <SelectItem value="almajeed">Almajeed</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default FontSelect;
