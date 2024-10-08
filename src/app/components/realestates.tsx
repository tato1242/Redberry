"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import Link from "next/link";
import { getRegions, Region } from "../services/api";
import RegionFilter from "./RegionFilter";

const Realestates = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [isRegionDropdownOpen, setIsRegionDropdownOpen] = useState(false);
  const [isPriceDropdownOpen, setIsPriceDropdownOpen] = useState(false);
  const [isAreaDropdownOpen, setIsAreaDropdownOpen] = useState(false);
  const [isBedroomDropdownOpen, setIsBedroomDropdownOpen] = useState(false);

  const [filters, setFilters] = useState({
    minPrice: "",
    maxPrice: "",
    minArea: "",
    maxArea: "",
    region: "",
    bedrooms: "",
  });

  const [filteredProperties, setFilteredProperties] = useState([]);

  const clearFilters = () => {
    setFilters({
      minPrice: "",
      maxPrice: "",
      minArea: "",
      maxArea: "",
      region: "",
      bedrooms: "",
    });
    setSelectedRegions([]);
    setFilteredProperties(properties);
  };

  const removeFilter = (filterKey: string, value: string) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [filterKey]: "", 
    }));
    applyFilters();
  };

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const token = "9d009666-7a1f-45e4-b985-baa4be98f866";
        const response = await axios.get(
          "https://api.real-estate-manager.redberryinternship.ge/api/real-estates",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProperties(response.data);
        setFilteredProperties(response.data);
      } catch (error) {
        console.error("Error fetching the properties:", error);
        setError("Failed to fetch properties");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleRegionCheckboxChange = (regionName: string) => {
    setSelectedRegions((prevSelectedRegions) => {
      if (prevSelectedRegions.includes(regionName)) {
        return prevSelectedRegions.filter((region) => region !== regionName);
      } else {
        return [...prevSelectedRegions, regionName];
      }
    });
  };

  useEffect(() => {
    const fetchRegions = async () => {
      try {
        console.log("Fetching regions...");
        const regionsData = await getRegions();
        console.log("Regions fetched: ", regionsData);
        setRegions(regionsData);
      } catch (error) {
        console.error("Error fetching regions:", error);
        setError("Failed to fetch regions.");
      } finally {
        setLoading(false);
      }
    };

    fetchRegions();
  }, []);

  const toggleRegionDropdown = () => {
    setIsRegionDropdownOpen(!isRegionDropdownOpen);
    setIsPriceDropdownOpen(false);
    setIsBedroomDropdownOpen(false);
    setIsAreaDropdownOpen(false);
  };

  const togglePriceDropdown = () => {
    setIsPriceDropdownOpen(!isPriceDropdownOpen);
    setIsRegionDropdownOpen(false);
    setIsBedroomDropdownOpen(false);
    setIsAreaDropdownOpen(false);
  };

  const toggleAreaDropdown = () => {
    setIsAreaDropdownOpen(!isAreaDropdownOpen);
    setIsRegionDropdownOpen(false);
    setIsPriceDropdownOpen(false);
    setIsBedroomDropdownOpen(false);
  };
  const toggleBedroomDropdown = () => {
    setIsBedroomDropdownOpen(!isBedroomDropdownOpen);
    setIsAreaDropdownOpen(false);
    setIsRegionDropdownOpen(false);
    setIsPriceDropdownOpen(false);
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const applyFilters = () => {
    setIsRegionDropdownOpen(false);

    const { minPrice, maxPrice, minArea, maxArea, bedrooms } = filters;

    const isAnyFilterApplied =
      minPrice ||
      maxPrice ||
      minArea ||
      maxArea ||
      selectedRegions.length > 0 ||
      bedrooms;

    if (!isAnyFilterApplied) {
      setFilteredProperties(properties);
      return;
    }

    const filtered = properties.filter((property: any) => {
      let matchesAnyFilter = false;

      if (minPrice && property.price >= parseFloat(minPrice)) {
        matchesAnyFilter = true;
      }
      if (maxPrice && property.price <= parseFloat(maxPrice)) {
        matchesAnyFilter = true;
      }

      if (minArea && property.area >= parseFloat(minArea)) {
        matchesAnyFilter = true;
      }
      if (maxArea && property.area <= parseFloat(maxArea)) {
        matchesAnyFilter = true;
      }

      if (
        selectedRegions.length > 0 &&
        selectedRegions.includes(property.city?.region?.name)
      ) {
        matchesAnyFilter = true;
      }

      if (bedrooms && property.bedrooms === parseInt(bedrooms, 10)) {
        matchesAnyFilter = true;
      }

      return matchesAnyFilter;
    });

    setFilteredProperties(filtered);
  };

  if (loading) {
    return <p>Loading properties...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="flex flex-col justify-center font-firaGo ">
      <div className="flex justify-between items-start w-full mb-8">
  <div className="flex flex-wrap gap-[20px] w-[785px] h-[50px] border border-grey rounded-md">
    <div className="relative z-50">
      <button
        className="mt-2 border rounded-lg shadow-md w-[116px] h-[35px] bg-white"
        onClick={toggleRegionDropdown}
        title="აირჩიე რეგიონი"
      >
        რეგიონი
      </button>
      {isRegionDropdownOpen && (
        <div className="absolute mt-2 border rounded-lg shadow-md bg-white w-[731px]">
          <h3 className="font-firaGo w-[679px] h-[19px] text-[16px] ml-4 mt-4 font-bold">
            რეგიონის მიხედვით
          </h3>
          <ul className="p-4 grid grid-cols-3 gap-4 font-firaGo text-[14px] mt-2">
            {regions.map((region) => (
              <li key={region.id} className="cursor-pointer hover:bg-gray-100">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={selectedRegions.includes(region.name)}
                    onChange={() => handleRegionCheckboxChange(region.name)}
                    className="mr-2"
                  />
                  {region.name}
                </label>
              </li>
            ))}
            <div className="ml-[580px] mt-[8px] h-[33px] w-[77px]">
              <button
                onClick={applyFilters}
                className="bg-red-500 text-white font-medium px-6 py-2 rounded-md hover:bg-red-600"
              >
                არჩევა
              </button>
            </div>
          </ul>
        </div>
      )}
      {filters.region && (
        <button
          onClick={() => removeFilter("region", filters.region)}
          className="filter-tag w-[full] border rounded-xl p-1"
        >
          {filters.region} ✕
        </button>
      )}
    </div>

    <div className="relative z-50">
      <button
        className="mt-2 border rounded-lg shadow-md w-[199px] h-[35px] bg-white"
        onClick={togglePriceDropdown}
        title="აირჩიე საფასო კატეგორია"
      >
        საფასო კატეგორია
      </button>
      {isPriceDropdownOpen && (
        <div className="absolute mt-2 border rounded-lg shadow-md bg-white p-4 w-[300px]">
          <h3 className="font-firaGo w-full text-[16px] mb-4 font-bold">
            ფასის მიხედვით
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="mb-4">
              <input
                placeholder="  დან"
                type="number"
                id="minPrice"
                name="minPrice"
                value={filters.minPrice}
                onChange={handleFilterChange}
                className="mt-2 border rounded-lg shadow-md w-full h-[35px] bg-white"
              />
            </div>
            <div>
              <input
                placeholder="  მდე"
                type="number"
                id="maxPrice"
                name="maxPrice"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                className="mt-2 border rounded-lg shadow-md w-full h-[35px] bg-white"
              />
            </div>

            <div className="col-span-2 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setFilters({
                    ...filters,
                    maxPrice: "50000",
                  });
                }}
                className="p-2 "
              >
                50,000 ₾
              </button>
              <button
                onClick={() => {
                  setFilters({
                    ...filters,
                    minPrice: "50000",
                    maxPrice: "100000",
                  });
                }}
                className="p-2 "
              >
                100,000 ₾
              </button>
              <button
                onClick={() => {
                  setFilters({
                    ...filters,
                    minPrice: "100000",
                    maxPrice: "150000",
                  });
                }}
                className="p-2 "
              >
                150,000 ₾
              </button>
              <button
                onClick={() => {
                  setFilters({
                    ...filters,
                    minPrice: "150000",
                    maxPrice: "200000",
                  });
                }}
                className="p-2 "
              >
                200,000 ₾
              </button>
              <button
                onClick={() => {
                  setFilters({
                    ...filters,
                    minPrice: "200000",
                    maxPrice: "300000",
                  });
                }}
                className="p-2 "
              >
                300,000 ₾
              </button>
            </div>

            <div className="ml-[150px] h-[33px] w-[77px]">
              <button
                onClick={applyFilters}
                className="bg-red-500 text-white font-medium px-6 py-2 rounded-md hover:bg-red-600"
              >
                არჩევა
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

    <div className="relative z-50">
      <button
        className="mt-2 border rounded-lg shadow-md w-[124px] h-[35px] bg-white"
        onClick={toggleAreaDropdown}
        title="აირჩიე ფართობი"
      >
        ფართობი
      </button>
      {isAreaDropdownOpen && (
        <div className="absolute mt-2 border rounded-lg shadow-md bg-white p-4 w-[300px]">
          <h3 className="font-firaGo w-full text-[16px] mb-4 font-bold">
            ფართის მიხედვით
          </h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="mb-4">
              <input
                placeholder="  დან"
                type="number"
                id="minArea"
                name="minArea"
                value={filters.minArea}
                onChange={handleFilterChange}
                className="mt-2 border rounded-lg shadow-md w-full h-[35px] bg-white"
              />
            </div>
            <div>
              <input
                placeholder="  მდე"
                type="number"
                id="maxArea"
                name="maxArea"
                value={filters.maxArea}
                onChange={handleFilterChange}
                className="mt-2 border rounded-lg shadow-md w-full h-[35px] bg-white"
              />
            </div>
            <div className="col-span-2 grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  setFilters({
                    ...filters,
                    maxArea: "50000",
                  });
                }}
                className="p-2 "
              >
                50,000 მ²
              </button>
              <button
                onClick={() => {
                  setFilters({
                    ...filters,
                    minArea: "50000",
                    maxArea: "100000",
                  });
                }}
                className="p-2 "
              >
                100,000 მ²
              </button>
              <button
                onClick={() => {
                  setFilters({
                    ...filters,
                    minArea: "100000",
                    maxArea: "150000",
                  });
                }}
                className="p-2 "
              >
                150,000 მ²
              </button>
              <button
                onClick={() => {
                  setFilters({
                    ...filters,
                    minArea: "150000",
                    maxArea: "200000",
                  });
                }}
                className="p-2 "
              >
                200,000 მ²
              </button>
              <button
                onClick={() => {
                  setFilters({
                    ...filters,
                    minArea: "200000",
                    maxArea: "300000",
                  });
                }}
                className="p-2 "
              >
                300,000 მ²
              </button>
            </div>
            <div className="ml-[150px] h-[33px] w-[77px]">
              <button
                onClick={applyFilters}
                className="bg-red-500 text-white font-medium px-6 py-2 rounded-md hover:bg-red-600"
              >
                არჩევა
              </button>
            </div>
          </div>
        </div>
      )}
    </div>

    <div className="relative z-50">
      <button
        className="mt-2 border rounded-lg shadow-md w-[262px] h-[35px] bg-white"
        onClick={toggleBedroomDropdown}
        title="აირჩიე საძინებლების რაოდენობა"
      >
        საძინებლების რაოდენობა
      </button>
      {isBedroomDropdownOpen && (
        <div className="absolute mt-2 border rounded-lg shadow-md bg-white p-4 w-[300px]">
          <h3 className="font-firaGo w-full text-[16px] mt-4 font-bold">
            საძინებლების რაოდენობა
          </h3>
          <div className="mb-4">
            <div className="flex justify-left mt-2">
              <input
                type="number"
                id="bedrooms"
                name="bedrooms"
                value={filters.bedrooms}
                onChange={handleFilterChange}
                className="border rounded-lg shadow-md w-[60px] h-[35px] bg-white"
              />
            </div>
          </div>
          <div className="ml-[150px] h-[33px] w-[77px]">
            <button
              onClick={applyFilters}
              className="bg-red-500 text-white font-medium px-6 py-2 rounded-md hover:bg-red-600"
            >
              არჩევა
            </button>
          </div>
        </div>
      )}
    </div>

    {filters.bedrooms && (
      <button
        onClick={() => removeFilter("bedrooms", filters.bedrooms)}
        className="filter-tag w-[full] border rounded-xl p-1"
      >
        {filters.bedrooms} ✕
      </button>
    )}

    <button
      onClick={clearFilters}
      className="clear-filters-button font-firaGo text-slate-900 text-[14px] font-semibold "
    >
      გასუფთავება
    </button>
  </div>

  <div className="flex-grow">
    <RegionFilter />
  </div>
</div>


      <div className="flex justify-center py-8 font-firaGo">
        {filteredProperties.length === 0 ? (
          <p className="text-[20px] font-firaGo ">
            აღნიშნული მონაცემებით განცხადება არ იძებნება
          </p>
        ) : (
          <ul className="grid gap-8 grid-cols-4 w-[1596px] ">
            {filteredProperties.map((property: any) => (
              <li
                key={property.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
              >
                <Link
                  href={`/aboutproperty/${property.id}?region=${property.city?.name}`}
                >
                  <div className="relative">
                    <span className="absolute top-[23px] left-[23px] bg-gray-600 h-[26px] w-[90px] text-white text-[12px] text-center rounded-full flex items-center justify-center font-firaGo">
                      {property.is_rental ? "ქირავდება" : "იყიდება"}
                    </span>
                    <img
                      src={property.image}
                      alt={property.address}
                      className="w-full h-56 object-cover rounded-md"
                    />
                  </div>

                  <div className="p-4">
                    <div className="flex  items-center mb-2">
                      <p className="text-xl font-bold text-gray-800">
                        {property.price.toLocaleString()} ₾
                      </p>
                    </div>
                    <p className="flex space-x-[4px] text-gray-600 mb-2">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fill-rule="evenodd"
                          clip-rule="evenodd"
                          d="M5.05025 4.05025C7.78392 1.31658 12.2161 1.31658 14.9497 4.05025C17.6834 6.78392 17.6834 11.2161 14.9497 13.9497L10 18.8995L5.05025 13.9497C2.31658 11.2161 2.31658 6.78392 5.05025 4.05025ZM10 11C11.1046 11 12 10.1046 12 9C12 7.89543 11.1046 7 10 7C8.89543 7 8 7.89543 8 9C8 10.1046 8.89543 11 10 11Z"
                          fill="#021526"
                          fill-opacity="0.5"
                        />
                      </svg>
                      {property.address},{" "}
                      {property.city?.name ?? "Unknown City"}
                    </p>
                    <div className="flex items-center text-gray-600 space-x-[32px]">
                      <div className="flex items-center space-x-1">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M20.25 10.8141C19.7772 10.6065 19.2664 10.4996 18.75 10.5H5.25C4.73368 10.4995 4.22288 10.6063 3.75 10.8136C3.08166 11.1059 2.51294 11.5865 2.11336 12.1968C1.71377 12.8071 1.50064 13.5205 1.5 14.25V19.5C1.5 19.6989 1.57902 19.8897 1.71967 20.0303C1.86032 20.171 2.05109 20.25 2.25 20.25C2.44891 20.25 2.63968 20.171 2.78033 20.0303C2.92098 19.8897 3 19.6989 3 19.5V19.125C3.00122 19.0259 3.04112 18.9312 3.11118 18.8612C3.18124 18.7911 3.27592 18.7512 3.375 18.75H20.625C20.7241 18.7512 20.8188 18.7911 20.8888 18.8612C20.9589 18.9312 20.9988 19.0259 21 19.125V19.5C21 19.6989 21.079 19.8897 21.2197 20.0303C21.3603 20.171 21.5511 20.25 21.75 20.25C21.9489 20.25 22.1397 20.171 22.2803 20.0303C22.421 19.8897 22.5 19.6989 22.5 19.5V14.25C22.4993 13.5206 22.2861 12.8073 21.8865 12.1971C21.4869 11.5869 20.9183 11.1063 20.25 10.8141Z"
                            fill="#021526"
                            fill-opacity="0.5"
                          />
                          <path
                            d="M17.625 3.75H6.375C5.67881 3.75 5.01113 4.02656 4.51884 4.51884C4.02656 5.01113 3.75 5.67881 3.75 6.375V9.75C3.75002 9.77906 3.75679 9.80771 3.76979 9.8337C3.78278 9.85969 3.80163 9.8823 3.82486 9.89976C3.84809 9.91721 3.87505 9.92903 3.90363 9.93428C3.93221 9.93953 3.96162 9.93806 3.98953 9.93C4.39897 9.81025 4.82341 9.74964 5.25 9.75H5.44828C5.49456 9.75029 5.53932 9.73346 5.57393 9.70274C5.60855 9.67202 5.63058 9.62958 5.63578 9.58359C5.67669 9.21712 5.85115 8.87856 6.12586 8.63256C6.40056 8.38656 6.75625 8.25037 7.125 8.25H9.75C10.119 8.25003 10.475 8.38606 10.75 8.63209C11.025 8.87812 11.1997 9.21688 11.2406 9.58359C11.2458 9.62958 11.2679 9.67202 11.3025 9.70274C11.3371 9.73346 11.3818 9.75029 11.4281 9.75H12.5747C12.621 9.75029 12.6657 9.73346 12.7003 9.70274C12.735 9.67202 12.757 9.62958 12.7622 9.58359C12.8031 9.21736 12.9773 8.87899 13.2517 8.63303C13.5261 8.38706 13.8815 8.25072 14.25 8.25H16.875C17.244 8.25003 17.6 8.38606 17.875 8.63209C18.15 8.87812 18.3247 9.21688 18.3656 9.58359C18.3708 9.62958 18.3929 9.67202 18.4275 9.70274C18.4621 9.73346 18.5068 9.75029 18.5531 9.75H18.75C19.1766 9.74979 19.6011 9.81057 20.0105 9.93047C20.0384 9.93854 20.0679 9.94 20.0965 9.93473C20.1251 9.92945 20.1521 9.91759 20.1753 9.90009C20.1986 9.88258 20.2174 9.8599 20.2304 9.83385C20.2433 9.8078 20.2501 9.7791 20.25 9.75V6.375C20.25 5.67881 19.9734 5.01113 19.4812 4.51884C18.9889 4.02656 18.3212 3.75 17.625 3.75Z"
                            fill="#021526"
                            fill-opacity="0.5"
                          />
                        </svg>

                        <span>{property.bedrooms}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <svg
                          width="18"
                          height="18"
                          viewBox="0 0 18 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M0 16C0 16.5304 0.210714 17.0391 0.585786 17.4142C0.960859 17.7893 1.46957 18 2 18H16C16.5304 18 17.0391 17.7893 17.4142 17.4142C17.7893 17.0391 18 16.5304 18 16V2C18 1.46957 17.7893 0.960859 17.4142 0.585786C17.0391 0.210714 16.5304 0 16 0H2C1.46957 0 0.960859 0.210714 0.585786 0.585786C0.210714 0.960859 0 1.46957 0 2V16ZM9 3H15V9H13V5H9V3ZM3 9H5V13H9V15H3V9Z"
                            fill="#021526"
                            fill-opacity="0.5"
                          />
                        </svg>

                        <span>{property.area} მ²</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <svg
                          width="16"
                          height="18"
                          viewBox="0 0 16 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M7.01717 0.338139C6.80803 0.554674 6.69051 0.848379 6.69045 1.15465V4.14122H1.11507C0.819339 4.14122 0.535715 4.2629 0.326598 4.47948C0.117481 4.69607 0 4.98982 0 5.29612V9.91571C0 10.222 0.117481 10.5158 0.326598 10.7323C0.535715 10.9489 0.819339 11.0706 1.11507 11.0706H6.69045V18H8.9206V11.0706H12.859C13.0225 11.0705 13.1839 11.0333 13.3319 10.9614C13.4799 10.8896 13.6108 10.7849 13.7154 10.6548L15.8709 7.97548C15.9543 7.87172 16 7.74095 16 7.60591C16 7.47088 15.9543 7.34011 15.8709 7.23635L13.7154 4.55698C13.6108 4.42691 13.4799 4.32225 13.3319 4.2504C13.1839 4.17856 13.0225 4.14128 12.859 4.14122H8.9206V1.15465C8.92055 0.926271 8.85513 0.703031 8.7326 0.513154C8.61007 0.323278 8.43594 0.175289 8.23221 0.0878981C8.02849 0.000506892 7.80432 -0.0223635 7.58805 0.0221781C7.37178 0.0667197 7.17311 0.176673 7.01717 0.338139Z"
                            fill="#021526"
                            fill-opacity="0.5"
                          />
                        </svg>

                        <span>{property.zip_code}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Realestates;
