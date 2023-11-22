"use client";

import { Card, LineChart, Title, AreaChart, Button } from "@tremor/react";
import React from "react";

const chartdata2 = [
  {
    date: "Jan 23",
    "2022": 45,
    "2023": 78,
  },
  {
    date: "Feb 23",
    "2022": 52,
    "2023": 71,
  },
  {
    date: "Mar 23",
    "2022": 48,
    "2023": 80,
  },
  {
    date: "Apr 23",
    "2022": 61,
    "2023": 65,
  },
  {
    date: "May 23",
    "2022": 55,
    "2023": 58,
  },
  {
    date: "Jun 23",
    "2022": 67,
    "2023": 62,
  },
  {
    date: "Jul 23",
    "2022": 60,
    "2023": 54,
  },
  {
    date: "Aug 23",
    "2022": 72,
    "2023": 49,
  },
  {
    date: "Sep 23",
    "2022": 65,
    "2023": 52,
  },
  {
    date: "Oct 23",
    "2022": 68,
    "2023": null,
  },
  {
    date: "Nov 23",
    "2022": 74,
    "2023": null,
  },
  {
    date: "Dec 23",
    "2022": 71,
    "2023": null,
  },
];

export const LineChartInteractiveExample = () => {
  return (
    <>
      <div className="flex justify-between items-center">
        <Title className="font-bold">Closed Pull Requests</Title>
        <div className="space-x-1">
          <Button variant="secondary" size="xs" color="gray">
            Year
          </Button>
          <Button variant="secondary" size="xs" color="gray">
            Month
          </Button>
          <Button variant="secondary" size="xs" color="gray">
            Week
          </Button>
        </div>
      </div>
      <AreaChart
        className="h-72 mt-4"
        data={chartdata2}
        index="date"
        categories={["2022", "2023"]}
        colors={["emerald", "indigo"]}
        yAxisWidth={30}
        connectNulls={true}
      />
    </>
  );
};
