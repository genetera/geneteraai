import React from "react";
import { XCircleIcon } from "@heroicons/react/24/outline";

const NoContent = () => {
  return (
    <div className="w-full flex justify-center items-center h-96">
      <div className="flex flex-col items-center">
        <div className="bg-gray-200 flex justify-center items-center w-10 h-10 rounded-md">
          <XCircleIcon className="w-5 h-5 text-gray-800" />
        </div>
        <span className="font-bold text-sm mt-2">No Data</span>
      </div>
    </div>
  );
};

export default NoContent;
