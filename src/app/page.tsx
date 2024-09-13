"use client"
import { useState } from "react";
import CityFilter from "./components/RegionFilter";
import RealEstates from "./components/realestates"
import RegionFilter from "./components/RegionFilter";
export default function Home() {
  const [selectedRegions, setSelectedRegions] = useState<number[]>([]);

  const handleFilterChange = (Regions: number[]) => {
    setSelectedRegions(Regions);
  };

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 gap-4">
        <aside className="col-span-1">
          <RegionFilter onChange={handleFilterChange} />
        </aside>
        <main className="col-span-3">
          <RealEstates />
        </main>
      </div>
    </div>
  );
}
