import { useState, useEffect } from "react";
import axios from "axios";

interface AgentsModalProps {
  onClose: () => void;
  isOpen: boolean;
}

const AgentsModal = ({ onClose, isOpen }: AgentsModalProps) => {
  const [name, setName] = useState(localStorage.getItem("name") || "");
  const [surname, setSurname] = useState(localStorage.getItem("surname") || "");
  const [email, setEmail] = useState(localStorage.getItem("email") || "");
  const [avatar, setAvatar] = useState<File | null>(null);
  const [phone, setPhone] = useState(localStorage.getItem("phone") || "");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    localStorage.setItem("name", name);
  }, [name]);

  useEffect(() => {
    localStorage.setItem("surname", surname);
  }, [surname]);

  useEffect(() => {
    localStorage.setItem("email", email);
  }, [email]);

  useEffect(() => {
    localStorage.setItem("phone", phone);
  }, [phone]);
  

  const validateForm = () => {
    if (name.length < 2) return "Name should have at least 2 characters";
    if (surname.length < 2) return "Surname should have at least 2 characters";
    if (!email.endsWith("@redberry.ge")) return "Email must end with @redberry.ge";
    if (!/5\d{8}$/.test(phone)) return "Phone number must be in the format 5XXXXXXXXX";
    if (!avatar) return "Avatar is required";
    return "";
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
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

      await axios.post(
        "https://api.real-estate-manager.redberryinternship.ge/api/agents",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Agent added successfully");
      localStorage.removeItem("name");
      localStorage.removeItem("surname");
      localStorage.removeItem("email");
      localStorage.removeItem("phone");
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-[750px]">
        <h2 className="text-center text-2xl font-bold mb-6">აგენტის დამატება</h2>
        {errorMessage && <p className="text-red-500 text-center">{errorMessage}</p>}

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="name" className="block font-medium mb-1">სახელი *</label>
            <input
              type="text"
              id="name"
              className="border w-full p-2 rounded-md"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="surname" className="block font-medium mb-1">გვარი *</label>
            <input
              type="text"
              id="surname"
              className="border w-full p-2 rounded-md"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="email" className="block font-medium mb-1">ელ-ფოსტა *</label>
            <input
              type="email"
              id="email"
              className="border w-full p-2 rounded-md"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="phone" className="block font-medium mb-1">ტელეფონის ნომერი *</label>
            <input
              type="text"
              id="phone"
              className="border w-full p-2 rounded-md"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="col-span-2">
            <label htmlFor="avatar" className="block font-medium mb-1">აგენტის ფოტო *</label>
            <div className="border-dashed border-2 border-gray-300 rounded-md p-4 text-center">
              <input
                type="file"
                id="avatar"
                onChange={(e) => setAvatar(e.target.files ? e.target.files[0] : null)}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            className="px-6 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-50"
            onClick={onClose}
          >
            გაუქმება
          </button>
          <button
            className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
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
