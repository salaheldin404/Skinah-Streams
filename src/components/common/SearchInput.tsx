"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { LuSearch } from "react-icons/lu";

interface SearchInputProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  className?: string;
}

const SearchInput = ({
  value,
  onChange,
  placeholder,
  className,
}: SearchInputProps) => {
  return (
    <div className={`${className} relative mb-8 mx-auto max-w-md `}>
      <LuSearch className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder={placeholder}
        className=" bg-white pl-10 pr-4 py-2 rounded border focus-visible:ring-0  focus-visible:outline-none"
        value={value}
        onChange={onChange}
      />
    </div>
  );
};

export default SearchInput;
