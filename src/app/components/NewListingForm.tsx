"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getRegions,
  getCities,
  getAgents,
  City,
  Agent,
  Region,
} from "../services/api";
import FileUpload from "./FileUpload";
import AgentsModal from "./AgentsModal";

interface NewListingFormProps {
  onSubmit: (data: any) => Promise<void>;
}

export default function NewListingForm({ onSubmit }: NewListingFormProps) {
  const [address, setAddress] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [regions, setRegions] = useState<Region[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [selectedRegion, setSelectedRegion] = useState<number | null>(null);
  const [filteredCities, setFilteredCities] = useState<City[]>([]);
  const [selectedCities, setSelectedCities] = useState<number[]>([]);
  const [price, setPrice] = useState("");
  const [area, setArea] = useState("");
  const [bedrooms, setBedrooms] = useState("");
  const [description, setDescription] = useState("");
  const [saleType, setSaleType] = useState("sale");
  const [agents, setAgents] = useState<Agent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<number | null>(null);

  const router = useRouter();

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

    async function fetchAgents() {
      try {
        const agentsData = await getAgents();
        setAgents(agentsData);
      } catch (error) {
        console.error("Failed to load agents:", error);
      }
    }

    fetchAgents();
  }, []);

  useEffect(() => {
    async function fetchCities() {
      try {
        const citiesData = await getCities(0);
        setCities(citiesData);
      } catch (error) {
        console.error("Failed to load cities:", error);
      }
    }
    fetchCities();
  }, []);

  useEffect(() => {
    if (selectedRegion !== null) {
      const filtered = cities.filter(
        (city) => city.region_id === selectedRegion
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities([]);
    }
  }, [selectedRegion, cities]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (
      uploadedFile &&
      uploadedFile.size <= 1048576 &&
      uploadedFile.type.startsWith("image/")
    ) {
      setFile(uploadedFile);
    } else {
      alert("Please select an image file of type PNG/JPG and size under 1MB.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!address || address.length < 2) {
      alert("მისამართი აუცილებელია და უნდა შეიცავდეს მინიმუმ ორ ასოს.");
      return;
    }
    if (!postalCode || isNaN(Number(postalCode))) {
      alert("საფოსტო კოდი აუცილებელია და უნდა იყოს რიცხვების სახით.");
      return;
    }
    if (!selectedRegion) {
      alert("გთხოვთ აირჩიოთ რეგიონი.");
      return;
    }
    if (!selectedCities.length) {
      alert("გთხოვთ აირჩიოთ ქალაქი.");
      return;
    }
    if (!price || isNaN(Number(price))) {
      alert("ფასის მითითება აუცილებელია.");
      return;
    }
    if (!area || isNaN(Number(area))) {
      alert("ფართობის მითითება აუცილებელია.");
      return;
    }
    if (!bedrooms || !Number.isInteger(Number(bedrooms))) {
      alert("საძინებლების რაოდენობის მითითება აუცილებელია.");
      return;
    }
    if (!description || description.split(" ").length < 5) {
      alert("აღწერა უნდა შეიცავდეს მინიმუმ 5 სიტყვას");
      return;
    }
    if (!file) {
      alert("სურათის დამატება აუცილებელია.");
      return;
    }
    if (!selectedAgent) {
      alert("გთხოვთ აირჩიოთ აგენტი.");
      return;
    }

    const formData = {
      address,
      file,
      region: selectedRegion,
      cities: selectedCities,
      postalCode,
      price,
      area,
      bedrooms,
      description,
      saleType,
      agent: selectedAgent,
    };

    try {
      await onSubmit(formData);
      router.push("/");
    } catch (error) {
      alert("An error occurred while submitting the form. Please try again.");
    }
  };

  const handleCancel = () => {
    setAddress("");
    setPostalCode("");
    setSelectedRegion(null);
    setSelectedCities([]);
    setPrice("");
    setArea("");
    setBedrooms("");
    setDescription("");
    setFile(null);
    setSelectedAgent(null);

    router.push("/");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 max-w-[790px] mx-auto">
      <h1 className="text-4xl font-bold mb-8 text-center">
        ლისტინგის დამატება
      </h1>
      <div>
        <h1 className="font-bold text-[16px] ">გარიგების ტიპი</h1>
        <div className="flex space-x-4 mt-3">
          <label className="font-semibold">
            <input
              type="radio"
              name="saleType"
              value="sale"
              checked={saleType === "sale"}
              onChange={() => setSaleType("sale")}
              className="mr-2"
            />
            იყიდება
          </label>
          <label className="font-semibold">
            <input
              type="radio"
              name="saleType"
              value="rent"
              checked={saleType === "rent"}
              onChange={() => setSaleType("rent")}
              className="mr-2"
            />
            ქირავდება
          </label>
        </div>
      </div>

      <div>
        <h1 className="font-bold text-[16px]">მდებარეობა</h1>
        <div className="grid grid-cols-2 gap-8 mt-3">
          <div>
            <label className="block font-semibold mb-1">მისამართი*</label>
            <input
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              minLength={2}
              className="border p-2 w-full rounded"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">საფოსტო ინდექსი*</label>
            <input
              type="text"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              className="border p-2 w-full rounded"
            />
          </div>
          <div>
            <label className="block font-semibold mb-1">რეგიონი*</label>
            <select
              onChange={(e) => setSelectedRegion(Number(e.target.value))}
              className="border p-2 w-full rounded"
            >
              <option value="">აირჩიეთ რეგიონი</option>
              {regions.map((region) => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-semibold mb-1">ქალაქი*</label>
            <select
              onChange={(e) => setSelectedCities([Number(e.target.value)])}
              className="border p-2 w-full rounded"
            >
              <option value="">აირჩიეთ ქალაქი</option>
              {filteredCities.map((city) => (
                <option key={city.id} value={city.id}>
                  {city.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-col space-y-[20px]">
        <h1 className="font-bold text-[16px] mt-[80px]">ბინის დეტალები</h1>
        <div className="grid grid-cols-2 gap-8 mt-3 space-x[20px]">
          <div>
            <label className="block font-semibold mb-1">ფასი*</label>
            <input
              type="text"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="border p-2 w-full rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">ფართობი*</label>
            <input
              type="text"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="border p-2 w-full rounded"
            />
          </div>

          <div>
            <label className="block font-semibold mb-1">
              საძინებლების რაოდენობა*
            </label>
            <input
              type="text"
              value={bedrooms}
              onChange={(e) => setBedrooms(e.target.value)}
              className="border p-2 w-full rounded"
            />
          </div>
        </div>
        <label className="block font-semibold mb-1">აღწერა*</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="border p-2 w-full rounded"
          rows={4}
        ></textarea>

        <div>
          <FileUpload onFileSelect={(file) => setFile(file)} />
        </div>
      </div>

      <div>
        <label className="block font-semibold mb-1">აგენტი</label>
        <select
          onChange={(e) => setSelectedAgent(Number(e.target.value))}
          className="border p-2 w-[384px] rounded"
        >
          <option value="">აირჩიეთ აგენტი</option>
          {agents.map((agent) => (
            <option key={agent.id} value={agent.id}>
              {agent.name}
              {agent.surname}
            </option>
          ))}
        </select>
      </div>

      <div className="text-right">
        <button
          type="button"
          className="border border-red-500 text-red-500 font-medium h-[47px] w-[103px] rounded-md hover:bg-red-100"
          onClick={handleCancel}
        >
          გაუქმება
        </button>
        <button
          className="bg-red-500 text-white font-firaGo text-[16px]  h-[47px] w-[187px] mx-[15px] rounded-md hover:bg-red-600"
          type="submit"
          onClick={handleSubmit}
        >
          დაამატე ლისტინგი
        </button>
      </div>
    </form>
  );
}
