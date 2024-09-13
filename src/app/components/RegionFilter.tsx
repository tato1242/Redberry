import { useState, useEffect } from "react";
import { getRegions, Region } from "../services/api";

interface RegionFilterProps {
  onChange: (selectedRegions: number[]) => void;
}

export default function RegionFilter({ onChange }: RegionFilterProps) {
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<number[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function fetchRegions() {
      try {
        const regionsData = await getRegions();
        setRegions(regionsData);
      } catch (error) {
        console.error("Failed to load regions:", error);
      }
    }
    fetchRegions();
  }, []);

  const handleCheckboxChange = (regionId: number) => {
    const updatedSelections = selectedRegions.includes(regionId)
      ? selectedRegions.filter((id) => id !== regionId)
      : [...selectedRegions, regionId];
    setSelectedRegions(updatedSelections);
  };

  const handleApply = () => {
    onChange(selectedRegions);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex justify-between items-center">
      <div className="relative z-50">
        {" "}
        <button
          onClick={toggleDropdown}
          className="px-4 py-2 border rounded-md bg-white shadow-sm focus:outline-none flex items-center"
        >
          <span>რეგიონი</span>
          <span className="ml-2">
            {isOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 15.75-7.5-7.5-7.5 7.5"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            )}
          </span>
        </button>
        {isOpen && (
          <div className="absolute left-0 mt-2 p-4 border rounded-lg shadow-md bg-white w-[731px] max-w-lg z-50">
            <div className="grid grid-cols-3 gap-y-[16px]">
              {regions.map((region) => (
                <label key={region.id} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    value={region.id}
                    checked={selectedRegions.includes(region.id)}
                    onChange={() => handleCheckboxChange(region.id)}
                    className="form-checkbox h-5 w-5"
                  />
                  <span className="ml-2 text-gray-700">{region.name}</span>
                </label>
              ))}
            </div>
            <button
              onClick={handleApply}
              className="float-right w-1/6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
            >
              არჩევა
            </button>
          </div>
        )}
      </div>

      <div className="flex space-x-[16px]">
        <button className="bg-red-500 text-white font-medium px-6 py-2 h-[47px] w-[230px] rounded-md hover:bg-red-600">
          + ლისტინგის დამატება
        </button>
        <button className="border border-red-500 text-red-500 font-medium h-[47px] w-[230px] px-6 py-2 rounded-md hover:bg-red-100">
          + აგენტის დამატება
        </button>
      </div>
    </div>
  );
}
