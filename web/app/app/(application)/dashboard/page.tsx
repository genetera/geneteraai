"use client";
import { useState } from "react";
import { Button } from "@tremor/react";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import Bar from "@/components/dashboard/bar-chat";
import Text from "@/components/ui/text";
import Metrics from "@/components/dashboard/metrics";
export default function Dashboard() {
  return (
    <>
      <div className="px-10 py-2">
        <div className="flex flex-row justify-between items-center">
          <Text className="text-4xl font-extrabold text-black-500">
            Dashboard
          </Text>
          <div className="space-x-2">
            <Button icon={PlusCircleIcon} color="emerald" size="sm">
              Crete content
            </Button>
          </div>
        </div>

        <Metrics />

        <div className="py-5">
          <Bar />
        </div>
      </div>
    </>
  );
}
