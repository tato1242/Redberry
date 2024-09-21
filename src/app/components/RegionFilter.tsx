"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Agent, getRegions, Region } from "../services/api";
import AgentsModal from "./AgentsModal";

export default function RegionFilter() {
  const [regions, setRegions] = useState<Region[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [agents, setAgents] = useState<Agent[]>([]);

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

  const openModal = () => {
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };
  const handleAgentAdded = (newAgent: {
    id: number;
    name: string;
    surname: string;
    avatar: string;
  }) => {
    setAgents((prevAgents) => [...prevAgents, newAgent]);
  };

  return (
    <div className="relative flex justify-end items-end">
      <div className="flex space-x-[16px]">
        <Link href="/new-listing">
          <button className="bg-red-500  text-white font-firaGo px-6 py-2 h-[47px] w-[232px] rounded-md hover:bg-red-600">
            + ლისტინგის დამატება
          </button>
        </Link>

        <button
          className="border border-red-500 text-red-500 font-medium h-[47px] w-[230px] px-6 py-2 rounded-md hover:bg-red-100"
          onClick={openModal}
        >
          + აგენტის დამატება
        </button>
      </div>
      <AgentsModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onAgentAdded={handleAgentAdded}
      />
    </div>
  );
}
