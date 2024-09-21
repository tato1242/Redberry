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
import axios from "axios";

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
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<number | null>(null);
  const [validations, setValidations] = useState({
    address: "default",
    postalCode: "default",
    price: "default",
    area: "default",
    bedrooms: "default",
    description: "default",
  });

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


  const validateField = (field: string, value: string | File | null) => {
    if (!value) return "default";
    switch (field) {
      case "address":
        return typeof value === "string" && value.length >= 2
          ? "valid"
          : "invalid";
      case "postalCode":
        return typeof value === "string" && !isNaN(Number(value))
          ? "valid"
          : "invalid";
      case "price":
      case "area":
        return typeof value === "string" && !isNaN(Number(value))
          ? "valid"
          : "invalid";
      case "bedrooms":
        return typeof value === "string" && Number.isInteger(Number(value))
          ? "valid"
          : "invalid";
      case "description":
        return typeof value === "string" && value.split(" ").length >= 5
          ? "valid"
          : "invalid";
      default:
        return "default";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const isValidForm = Object.values(validations).every(
      (status) => status === "valid"
    );

    if (!isValidForm) {
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

  const getInputClasses = (status: string) => {
    switch (status) {
      case "valid":
        return "border-green-500 text-green-500";
      case "invalid":
        return "border-red-500 text-red-500";
      default:
        return "border-gray-300";
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

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const handleAgentAdded = (newAgent: { id: number; name: string; surname: string;avatar: string; }) => {
    setAgents((prevAgents) => [...prevAgents, newAgent]);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-8 max-w-[790px] mx-auto font-firaGo"
    >
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
              onChange={(e) => {
                setAddress(e.target.value);
                setValidations((prev) => ({
                  ...prev,
                  address: validateField("address", e.target.value),
                }));
              }}
              className={`border p-2 w-full rounded text-black ${getInputClasses(
                validations.address
              )}`}
            />
            <p
              className={`${
                validations.address === "invalid"
                  ? "text-red-500"
                  : validations.address === "valid"
                  ? "text-green-500"
                  : "text-black"
              }`}
            >
              ✔ მინიმუმ 2 სიმბოლო
            </p>
          </div>
          <div>
            <label className="block font-semibold mb-1">საფოსტო ინდექსი*</label>
            <input
              type="text"
              value={postalCode}
              onChange={(e) => {
                setPostalCode(e.target.value);
                setValidations((prev) => ({
                  ...prev,
                  postalCode: validateField("postalCode", e.target.value),
                }));
              }}
              className={`border p-2 w-full rounded text-black ${getInputClasses(
                validations.postalCode
              )}`}
            />
            <p
              className={`${
                validations.postalCode === "invalid"
                  ? "text-red-500"
                  : validations.postalCode === "valid"
                  ? "text-green-500"
                  : "text-black"
              }`}
            >
              ✔ მხოლოდ რიცხვები
            </p>
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
              onChange={(e) => {
                setPrice(e.target.value);
                setValidations((prev) => ({
                  ...prev,
                  price: validateField("price", e.target.value),
                }));
              }}
              className={`border p-2 w-full rounded text-black ${getInputClasses(
                validations.price
              )}`}
            />
            <p
              className={`${
                validations.price === "invalid"
                  ? "text-red-500"
                  : validations.price === "valid"
                  ? "text-green-500"
                  : "text-black"
              }`}
            >
              ✔ მხოლოდ რიცხვები
            </p>
          </div>

          <div>
            <label className="block font-semibold mb-1">ფართობი*</label>
            <input
              type="text"
              value={area}
              onChange={(e) => {
                setArea(e.target.value);
                setValidations((prev) => ({
                  ...prev,
                  area: validateField("area", e.target.value),
                }));
              }}
              className={`border p-2 w-full rounded text-black ${getInputClasses(
                validations.area
              )}`}
            />
            <p
              className={`${
                validations.area === "invalid"
                  ? "text-red-500"
                  : validations.area === "valid"
                  ? "text-green-500"
                  : "text-black"
              }`}
            >
              ✔ მხოლოდ რიცხვები
            </p>
          </div>

          <div>
            <label className="block font-semibold mb-1">
              საძინებლების რაოდენობა*
            </label>
            <input
              type="text"
              value={bedrooms}
              onChange={(e) => {
                setBedrooms(e.target.value);
                setValidations((prev) => ({
                  ...prev,
                  bedrooms: validateField("bedrooms", e.target.value),
                }));
              }}
              className={`border p-2 w-full rounded text-black ${getInputClasses(
                validations.bedrooms
              )}`}
            />
            <p
              className={`${
                validations.bedrooms === "invalid"
                  ? "text-red-500"
                  : validations.bedrooms === "valid"
                  ? "text-green-500"
                  : "text-black"
              }`}
            >
              ✔ მხოლოდ რიცხვები
            </p>
          </div>
        </div>
        <label className="block font-semibold mb-1">აღწერა*</label>
        <textarea
          value={description}
          onChange={(e) => {
            setDescription(e.target.value);
            setValidations((prev) => ({
              ...prev,
              description: validateField("description", e.target.value),
            }));
          }}
          className={`border p-2 w-full rounded text-black resize-none	 ${getInputClasses(
            validations.description
          )}`}
          rows={4}
        />
        <p
          className={`${
            validations.description === "invalid"
              ? "text-red-500"
              : validations.description === "valid"
              ? "text-green-500"
              : "text-black"
          }`}
        >
          ✔ მინიმუმ 5 სიტყვა
        </p>

        <div>
          <FileUpload onFileSelect={(file) => setFile(file)} />
        </div>
      </div>
      <div>
      <label className="block font-semibold mb-1">აგენტი</label>
      <select
        value={selectedAgent || ""}
        onChange={(e) => {
          const selectedValue = e.target.value;
          if (selectedValue === "addAgent") {
            openModal();
            e.target.value = "";
          } else {
            setSelectedAgent(Number(selectedValue));
          }
        }}
        className="border border-slate-500 p-2 w-[384px] h-[42px] rounded-t-[6px] font-firaGo text-[14px]  "
      >
        <option value="">აირჩიეთ</option>
        <option value="addAgent">+ აგენტის დამატება</option>

        {agents.map((agent) => (
          <option key={agent.id} value={agent.id}>
            {agent.name} {agent.surname}
          </option>
        ))}
      </select>

      <AgentsModal isOpen={isModalOpen} onClose={closeModal} onAgentAdded={handleAgentAdded} />
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