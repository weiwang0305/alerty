"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { SearchResults } from "./search-results";
import { useDebounce } from "use-debounce";

export const UserSearch = () => {
  const router = useRouter();
  const [text, setText] = useState<string>("");
  const [query] = useDebounce(text, 500);

  const handleSearch = () => {
    router.push(`/overview?search=${query}`);
  };

  useEffect(() => {
    if (!query) router.push("/overview");
    else handleSearch();
  }, [query]);

  return (
    <div className="bg-green-700 p-4 shadow-sm">
      <div className="flex bg-white items-center p-2 rounded-md shadow-sm gap-1">
        <BiSearch />
        <input
          type="text"
          placeholder="Search users..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => (e.key === "Enter" ? handleSearch() : null)}
          className="w-full"
        />
      </div>
      <SearchResults />
    </div>
  );
};
