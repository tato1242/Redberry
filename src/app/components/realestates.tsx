"use client";
import axios from "axios";
import { useEffect, useState } from "react";

const Realestates = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const token = "9cfe1adf-b16e-46c1-a67d-170c3ed1b36b";
        const response = await axios.get(
          "https://api.real-estate-manager.redberryinternship.ge/api/real-estates",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setProperties(response.data);
      } catch (error) {
        console.error("Error fetching the properties:", error);
        setError("Failed to fetch properties");
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return <p>Loading properties...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="flex justify-center py-8">
      {properties.length === 0 ? (
        <p>No properties found</p>
      ) : (
        <ul className="grid gap-8 grid-cols-4 max-w-screen-lg">
          {properties.map((property: any) => (
            <li
              key={property.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              {/* Property Image */}
              <img
                src={property.image}
                alt={property.address}
                className="w-full h-56 object-cover"
              />

              {/* Property Details */}
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  {/* Price */}
                  <p className="text-xl font-bold text-gray-800">
                    {property.price.toLocaleString()} ₾
                  </p>

                  {/* Sale or Rental Label */}
                  <span className="bg-gray-200 text-gray-700 text-sm px-2 py-1 rounded">
                    {property.is_rental ? "ქირავდება" : "იყიდება"}
                  </span>
                </div>

                {/* Address */}
                <p className="text-gray-600 mb-2">
                  {property.address}, {property.city?.name ?? "Unknown City"}
                </p>

                {/* Property Features */}
                <div className="flex items-center text-gray-600 space-x-4">
                  <div className="flex items-center space-x-1">
                    <img
                      src="/icons/bedroom.svg"
                      alt="Bedrooms"
                      className="w-4 h-4"
                    />
                    <span>{property.bedrooms}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <img
                      src="/icons/area.svg"
                      alt="Area"
                      className="w-4 h-4"
                    />
                    <span>{property.area} მ²</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <img
                      src="/icons/code.svg"
                      alt="Code"
                      className="w-4 h-4"
                    />
                    <span>{property.zip_code}</span>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Realestates;
