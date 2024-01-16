import React from "react";
import { WrenchIcon, ArrowsPointingInIcon } from "@heroicons/react/24/outline";

const InDevelopment = () => {
  return (
    <div className="w-full flex justify-center items-center h-96">
      <div className="flex flex-col items-center">
        <div className="flex bg-red-200 justify-center items-center w-10 h-10 rounded-md">
          <ArrowsPointingInIcon className="w-5 h-5 text-gray-800" />
        </div>
        <span className="font-bold text-sm mt-2">Feature in development</span>
      </div>
    </div>
  );
};

export default InDevelopment;
