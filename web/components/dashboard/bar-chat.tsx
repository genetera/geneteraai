"use client";

import { useState } from "react";
import {
  Card,
  Title,
  BarChart,
  LineChart,
  AreaChart,
  Badge,
} from "@tremor/react";
import {
  MultiSelect,
  MultiSelectItem,
  Select,
  SelectItem,
} from "@tremor/react";

const data = [
  {
    Month: "Jan",
    Failed: 1200,
    Published: 1000,
  },
  {
    Month: "Feb",
    Failed: 1200,
    Published: 998,
  },
  {
    Month: "Mar",
    Failed: 1090,
    Published: 1000,
  },
  {
    Month: "Apr",
    Failed: 1380,
    Published: 978,
  },
  {
    Month: "May",
    Failed: 1190,
    Published: 1800,
  },
  {
    Month: "Jun",
    Failed: 1880,
    Published: 978,
  },
  {
    Month: "Jul",
    Failed: 1290,
    Published: 790,
  },
  {
    Month: "Aug",
    Failed: 2300,
    Published: 800,
  },
  {
    Month: "Sep",
    Failed: 2350,
    Published: 600,
  },
  {
    Month: "Oct",
    Failed: 2350,
    Published: 800,
  },
  {
    Month: "Nov",
    Failed: 2350,
    Published: 1200,
  },
  {
    Month: "Dec",
    Failed: 2350,
    Published: 1100,
  },
];

const valueFormatter = (number: number) =>
  Intl.NumberFormat("us").format(number).toString();

export default function Bar() {
  const [organizations, setOrganizations] = useState<string[]>([] as string[]);
  const [projects, setProjects] = useState<string[]>([] as string[]);
  const [year, setYear] = useState<string>("");

  return (
    <Card className="shadow-none">
      <div className="flex justify-start">
        <Title className="font-bold">Contents Statistics</Title>{" "}
        <div className="font-bold ml-1">
          <Badge color="pink">Coming soon</Badge>
        </div>
      </div>
      <div className="flex gap-2 mt-4 mb-2">
        <MultiSelect
          placeholder="All organizations"
          value={organizations}
          onValueChange={setOrganizations}
        >
          <MultiSelectItem value="1">Organization</MultiSelectItem>
        </MultiSelect>
        <MultiSelect
          placeholder="All projects"
          value={projects}
          onValueChange={setProjects}
        >
          <MultiSelectItem value="1">Project</MultiSelectItem>
        </MultiSelect>
        <MultiSelect
          placeholder="All platforms"
          value={organizations}
          onValueChange={setOrganizations}
        >
          <MultiSelectItem value="1">Platform</MultiSelectItem>
        </MultiSelect>
        <Select value={year} placeholder="Currect year" onValueChange={setYear}>
          <SelectItem value="2023">2023</SelectItem>
          <SelectItem value="2022">2022</SelectItem>
          <SelectItem value="2021">2021</SelectItem>
          <SelectItem value="2020">2020</SelectItem>
        </Select>
      </div>
      <AreaChart
        className="mt-4 h-80"
        data={data}
        index="Month"
        categories={["Published", "Failed"]}
        colors={["emerald", "cyan"]}
        valueFormatter={valueFormatter}
      />
    </Card>
  );
}
