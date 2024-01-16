import React from "react";
import { Tooltip } from "flowbite-react";
import ButtonSecondary from "./buttons/button-secondary";
import { Squares2X2Icon, ListBulletIcon } from "@heroicons/react/24/outline";

const LayoutView = () => {
  return (
    <div className="flex justify-end w-full">
      <div className="flex flex-row mb-2 mt-4">
        <Tooltip content="Grid view" placement="bottom">
          <ButtonSecondary icon={Squares2X2Icon} size="xs" color="emerald" />
        </Tooltip>
        <Tooltip content="List view" placement="bottom">
          <ButtonSecondary icon={ListBulletIcon} size="xs" className="ml-2" />
        </Tooltip>
      </div>
    </div>
  );
};

export default LayoutView;
