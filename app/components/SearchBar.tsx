"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

function SearchBar() {
  const router = useRouter();
  const [location, setLocation] = useState("");

  const handleKeyDown = (event: any) => {
    if (event.key === 'Enter') {
      router.push(`/search/?city=${location}`)
    }
  }
  
  return (
    <div className="text-left text-lg py-3 m-auto flex justify-center">
      <input
        className="rounded mr-3 p-2 w-[450px]"
        type="text"
        placeholder="State, city, or town"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        onKeyDown={(e) => handleKeyDown(e)} 
      />
      <button
        className="rounded bg-red-600 px-9 py-2 text-white"
        onClick={() => {
          router.push(`/search/?city=${location}`);
        }}
      >
        Let's go
      </button>
    </div>
  );
}

export default SearchBar;
