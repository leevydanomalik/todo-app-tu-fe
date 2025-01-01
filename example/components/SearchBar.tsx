import { Input } from "@roketid/windmill-react-ui";
import { SearchIcon } from "icons";
import React from "react";

const SearchBar = () => {
  return (
    <div className="">
      <div className="relative w-full max-w-xl mr-6 focus-within:text-purple-500">
        <div className="absolute inset-y-0 flex items-center pl-2">
          <SearchIcon className="w-4 h-4" aria-hidden="true" />
        </div>
        <Input
          className="pl-8 text-gray-700 w-[300px]"
          placeholder="Search for tasks"
          aria-label="Search"
        />
      </div>
    </div>
  );
};

export default SearchBar;
