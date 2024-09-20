import { useState } from "react";
import axios from "axios";
import FileUpload from "./FileUpload";

interface AgentsModalProps {
  onClose: () => void;
  isOpen: boolean;
  onAgentAdded: (newAgent: { id: number; name: string; surname: string;avatar:string; }) => void;
}

const AgentsModal = ({ onClose, isOpen, onAgentAdded }: AgentsModalProps) => {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [phone, setPhone] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [validations, setValidations] = useState({
    name: "default",
    surname: "default",
    email: "default",
    phone: "default",
    avatar: "default",
  });

  const validateField = (field: string, value: string | File | null) => {
    if (value === null || value === "") {
      return "default";
    }

    switch (field) {
      case "name":
      case "surname":
        return typeof value === "string" && value.length >= 2 ? "valid" : "invalid";
      case "email":
        return typeof value === "string" && value.endsWith("@redberry.ge") ? "valid" : "invalid";
      case "phone":
        return typeof value === "string" && /5\d{8}$/.test(value) ? "valid" : "invalid";
      case "avatar":
        return value instanceof File ? "valid" : "invalid";
      default:
        return "default";
    }
  };

  const handleInputChange = (field: string, value: string) => {
    switch (field) {
      case "name":
        setName(value);
        break;
      case "surname":
        setSurname(value);
        break;
      case "email":
        setEmail(value);
        break;
      case "phone":
        setPhone(value);
        break;
      default:
        break;
    }
    setValidations((prev) => ({
      ...prev,
      [field]: validateField(field, value),
    }));
  };

  const handleSubmit = async () => {
    const isFormValid =
      Object.values(validations).every((v) => v === "valid") && avatar;
    if (!isFormValid) {
      setErrorMessage("გთხოვთ შეავსეთ ყველა ველი.");
      return;
    }

    try {
      const token = "9d009666-7a1f-45e4-b985-baa4be98f866";
      const formData = new FormData();
      formData.append("name", name);
      formData.append("surname", surname);
      formData.append("email", email);
      formData.append("phone", phone);
      formData.append("avatar", avatar as Blob, avatar?.name);

      const response = await axios.post(
        "https://api.real-estate-manager.redberryinternship.ge/api/agents",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("აგენტი წარმატებით დაემატა");

      onAgentAdded({
        id: response.data.id,
        name: response.data.name,
        surname: response.data.surname,
        avatar:response.data.string,
      });

      setName("");
      setSurname("");
      setEmail("");
      setPhone("");
      setAvatar(null);

      onClose();
    } catch (error: any) {
      if (error.response) {
        console.error("Failed to add agent:", error.response.data);
        setErrorMessage(error.response.data.message || "Failed to add agent");
      } else {
        console.error("Error:", error.message);
        setErrorMessage("An error occurred while adding the agent");
      }
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 font-firaGo bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg h-[784px] w-[1009px]">
        <h2 className="text-center text-[32px] font-semibold mt-[75px]">აგენტის დამატება</h2>
        {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

        <div className="grid grid-cols-2 gap-4 mb-4 mt-[61px] max-w-[799px] ml-[80px] ">
          <div>
            <label htmlFor="name" className=" font-semibold h-[17px] text-[14px]">
              სახელი *
            </label>
            <input
              type="text"
              id="name"
              className={`border w-[384px]  p-2 rounded-md text-black ${validations.name === "default" ? "border-black" : getInputClasses(validations.name)}`}
              value={name}
              onChange={(e) => handleInputChange("name", e.target.value)}
            />
            <p className={`${validations.name === "invalid" ? "text-red-500" : validations.name === "valid" ? "text-green-500" : "text-black"}`}>
              ✔ მინიმუმ 2 სიმბოლო
            </p>
          </div>

          <div>
            <label htmlFor="surname" className=" font-semibold h-[17px] text-[14px]">გვარი *</label>
            <input
              type="text"
              id="surname"
              className={`border w-[384px] p-2 rounded-md text-black ${validations.surname === "default" ? "border-black" : getInputClasses(validations.surname)}`}
              value={surname}
              onChange={(e) => handleInputChange("surname", e.target.value)}
            />
            <p className={`${validations.surname === "invalid" ? "text-red-500" : validations.surname === "valid" ? "text-green-500" : "text-black"}`}>
              ✔ მინიმუმ 2 სიმბოლო
            </p>
          </div>

          <div>
            <label htmlFor="email" className=" font-semibold h-[17px] text-[14px]">ელ-ფოსტა *</label>
            <input
              type="email"
              id="email"
              className={`border w-[384px] p-2 rounded-md text-black ${validations.email === "default" ? "border-black" : getInputClasses(validations.email)}`}
              value={email}
              onChange={(e) => handleInputChange("email", e.target.value)}
            />
            <p className={`${validations.email === "invalid" ? "text-red-500" : validations.email === "valid" ? "text-green-500" : "text-black"}`}>✔ გამოიყენეთ @redberry.ge ფოსტა</p>
          </div>

          <div>
            <label htmlFor="phone" className=" font-semibold h-[17px] text-[14px]">ტელეფონის ნომერი *</label>
            <input
              type="text"
              id="phone"
              maxLength={9}
              className={`border w-[384px] p-2 rounded-md text-black ${validations.phone === "default" ? "border-black" : getInputClasses(validations.phone)}`}
              value={phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
            />
            <p className={`${validations.phone === "invalid" ? "text-red-500" : validations.phone === "valid" ? "text-green-500" : "text-black"}`}>✔ მხოლოდ რიცხვები</p>
          </div>

        </div>
          <div className="ml-[80px] mt-[34px]  ">
            <FileUpload
              onFileSelect={(file) => {
                setAvatar(file);
                setValidations((prev) => ({
                  ...prev,
                  avatar: validateField("avatar", file),
                }));
              }}
            />
          </div>

        <div className=" flex justify-end space-x-4 mt-[90px] text-[16px] font-firaGo ">
          <button
            className="px-6 py-2 border w-[161px] border-red-500 text-red-500 rounded-md hover:bg-red-50"
            onClick={onClose}
          >
            გაუქმება
          </button>
          <button
            className="px-6 py-2  bg-red-500 text-white rounded-md hover:bg-red-600"
            onClick={handleSubmit}
          >
            დაამატე აგენტი
          </button>
        </div>
      </div>
    </div>
  );
};

export default AgentsModal;
