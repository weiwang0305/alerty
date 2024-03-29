"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import { SearchResults } from "./search-results";
import { useDebounce } from "use-debounce";

export const UserSearch = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [text, setText] = useState<string>("");
  const [query] = useDebounce(text, 500);

  const handleSearch = () => {
    router.push(`/overview?search=${query}`);
  };

  useEffect(() => {
    if (pathname !== "/overview") return;
    else if (!query) router.push("/overview");
    else handleSearch();
  }, [query]);

  return (
    <div className="py-4 px-10">
      <div className="flex bg-white items-center p-2 rounded-md shadow-sm gap-1">
        <BiSearch size={25} />
        <input
          type="text"
          placeholder="Search users..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => (e.key === "Enter" ? handleSearch() : null)}
          className="w-full px-2"
        />
      </div>
      {text.length ? <SearchResults setText={setText} /> : null}
    </div>
  );
};
