import { useState } from "react";

interface FileUploadProps {
  onFileSelect: (file: File | null) => void;
}

const FileUpload = ({ onFileSelect }: FileUploadProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size <= 1048576 && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
      onFileSelect(file);
    } else {
      alert("Please select an image file of type PNG/JPG and size under 1MB.");
      setSelectedImage(null);
      onFileSelect(null);
    }
  };

  const handleDeleteImage = () => {
    setSelectedImage(null);
    onFileSelect(null);
  };

  return (
    <div>
      <label className="block font-semibold mb-1">ატვირთეთ ფოტო*</label>
      <div className="relative w-[788px] h-[120px] bg-white border border-dashed border-[#2D3648] rounded-lg flex items-center justify-center">
        {!selectedImage ? (
          <>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <div className="flex justify-center items-center">
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                  stroke="#2D3648"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M12 8V16"
                  stroke="#2D3648"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 12H16"
                  stroke="#2D3648"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </>
        ) : (
          <div className="relative">
            <img
              src={selectedImage}
              alt="Uploaded preview"
              className="w-[92px] h-[82px] object-cover rounded-md"
            />
            <button
              onClick={handleDeleteImage}
              className="absolute left-[80px] top-[65px] bg-white  rounded-full border border-[#2D3648]"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.75 8.5H7.91667H17.25"
                  stroke="#021526"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M16.0834 8.50033V16.667C16.0834 16.9764 15.9605 17.2732 15.7417 17.492C15.5229 17.7107 15.2262 17.8337 14.9167 17.8337H9.08341C8.774 17.8337 8.47725 17.7107 8.25846 17.492C8.03966 17.2732 7.91675 16.9764 7.91675 16.667V8.50033M9.66675 8.50033V7.33366C9.66675 7.02424 9.78966 6.72749 10.0085 6.5087C10.2272 6.28991 10.524 6.16699 10.8334 6.16699H13.1667C13.4762 6.16699 13.7729 6.28991 13.9917 6.5087C14.2105 6.72749 14.3334 7.02424 14.3334 7.33366V8.50033"
                  stroke="#021526"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M10.8333 11.417V14.917"
                  stroke="#021526"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
                <path
                  d="M13.1667 11.417V14.917"
                  stroke="#021526"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
