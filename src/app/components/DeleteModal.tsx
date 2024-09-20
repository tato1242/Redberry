import React from "react";

interface DeleteModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative bg-white rounded-[20px] shadow-lg text-center h-[222px] w-[623px] font-firaGo">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4"
        >
          <svg
            width="47"
            height="47"
            viewBox="0 0 47 47"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M23.5011 23.4999L29.0401 29.0389M17.9622 29.0389L23.5011 23.4999L17.9622 29.0389ZM29.0401 17.9609L23.5011 23.4999L29.0401 17.9609ZM23.5011 23.4999L17.9622 17.9609L23.5011 23.4999Z"
              stroke="#2D3648"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Modal Content */}
        <h2 className="text-lg mt-[56px] mb-4">
          გსურთ ნამდვილად ლისტინგის წაშლა?
        </h2>
        <div className="space-x-[15px] mt-[35px]">
          <button
            onClick={onCancel}
            className="px-6 py-2 border w-[161px] border-red-500 text-red-500 rounded-md hover:bg-red-50"
          >
            გაუქმება
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            დადასტურება
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
