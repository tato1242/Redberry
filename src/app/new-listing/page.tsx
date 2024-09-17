"use client"
import { submitListing } from "../services/api";
import NewListingForm from "../components/NewListingForm";

const token = "9d009666-7a1f-45e4-b985-baa4be98f866";
export default function NewListingPage() {
  const handleFormSubmit = async (formData: any) => {
    try {
      const response = await submitListing(formData, token);
      console.log("Listing successfully submitted:", response);
    } catch (error) {
      console.error("Error submitting listing:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <NewListingForm onSubmit={handleFormSubmit} />
    </div>
  );
}
