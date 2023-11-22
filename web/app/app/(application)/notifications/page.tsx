"use client";

import React from "react";
import Text from "@/components/ui/text";
import ButtonSecondary from "@/components/ui/buttons/button-secondary";
import { BookmarkIcon } from "@heroicons/react/24/outline";
import { Divider } from "@tremor/react";

const Notifications = () => {
  return (
    <>
      <div className="px-10 py-2 ">
        <div className="flex flex-row justify-between items-center">
          <Text className="text-4xl font-extrabold text-black-500">
            Notifications
          </Text>
          <div className="space-x-2">
            <ButtonSecondary icon={BookmarkIcon}>
              Mark all as read
            </ButtonSecondary>
          </div>
        </div>
        <div className="mt-8">
          <div className="lg:px-6 ">
            <h5 className="font-bold text-lg">
              New invitation to join project Qurity is approved
            </h5>
            <p className="mt-2">
              The notification paragraph will be here. And what will happen if
              it is clicked is that user will be redirected.
            </p>
            <p className="mt-2 text-gray-600">21-10-2023</p>
            <Divider />
          </div>
          <div className="lg:px-6 ">
            <h5 className="font-bold text-lg">
              New invitation to join project Qurity is approved
            </h5>
            <p className="mt-2">
              The notification paragraph will be here. And what will happen if
              it is clicked is that user will be redirected to notification
              details page
            </p>
            <p className="mt-2 text-gray-600">21-10-2023</p>
            <Divider />
          </div>
          <div className="lg:px-6 ">
            <h5 className="font-bold text-lg">
              New invitation to join project Qurity is approved
            </h5>
            <p className="mt-2">
              The notification paragraph will be here. And what will happen if
              it is clicked is that user will be redirected.
            </p>
            <p className="mt-2 text-gray-600">21-10-2023</p>
            <Divider />
          </div>
        </div>
      </div>
    </>
  );
};

export default Notifications;
