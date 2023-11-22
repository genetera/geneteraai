"use client";

import { useState } from "react";
import { Card, Title, BarChart, LineChart } from "@tremor/react";
import {
  MultiSelect,
  MultiSelectItem,
  Select,
  SelectItem,
} from "@tremor/react";

const data = [
  {
    Month: "Jan",
    Failed: 2890,
    Completed: 1400,
    "In Progress": 4938,
  },
  {
    Month: "Feb",
    Failed: 1890,
    Completed: 998,
    "In Progress": 2938,
  },
  {
    Month: "Mar",
    Failed: 3890,
    Completed: 2980,
    "In Progress": 2645,
  },
  {
    Month: "Apr",
    Failed: 1880,
    Completed: 978,
    "In Progress": 2938,
  },
  {
    Month: "May",
    Failed: 3890,
    Completed: 2980,
    "In Progress": 2645,
  },
  {
    Month: "Jun",
    Failed: 1880,
    Completed: 978,
    "In Progress": 2938,
  },
  {
    Month: "Jul",
    Failed: 3890,
    Completed: 2980,
    "In Progress": 2645,
  },
  {
    Month: "Aug",
    Failed: 2300,
    Completed: 800,
    "In Progress": 2938,
  },
  {
    Month: "Sep",
    Failed: 2350,
    Completed: 1300,
    "In Progress": 2645,
  },
  {
    Month: "Oct",
    Failed: 2350,
    Completed: 1300,
    "In Progress": 2645,
  },
  {
    Month: "Nov",
    Failed: 2350,
    Completed: 1300,
    "In Progress": 2645,
  },
  {
    Month: "Dec",
    Failed: 2350,
    Completed: 1300,
    "In Progress": 2645,
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
      <Title className="font-bold">Contents Statistics</Title>
      <div className="flex gap-2 mt-4 mb-2">
        <MultiSelect
          placeholder="All organizations"
          value={organizations}
          onValueChange={setOrganizations}
        >
          <MultiSelectItem value="1">Genetera</MultiSelectItem>
          <MultiSelectItem value="2">Vomaty</MultiSelectItem>
          <MultiSelectItem value="3">Quintify</MultiSelectItem>
          <MultiSelectItem value="4">FFCO</MultiSelectItem>
        </MultiSelect>
        <MultiSelect
          placeholder="All projects"
          value={projects}
          onValueChange={setProjects}
        >
          <MultiSelectItem value="1">Genetera</MultiSelectItem>
          <MultiSelectItem value="2">Vomaty</MultiSelectItem>
          <MultiSelectItem value="3">Quintify</MultiSelectItem>
          <MultiSelectItem value="4">FFCO</MultiSelectItem>
        </MultiSelect>
        <MultiSelect
          placeholder="All platforms"
          value={organizations}
          onValueChange={setOrganizations}
        >
          <MultiSelectItem value="1">Genetera</MultiSelectItem>
          <MultiSelectItem value="2">Vomaty</MultiSelectItem>
          <MultiSelectItem value="3">Quintify</MultiSelectItem>
          <MultiSelectItem value="4">FFCO</MultiSelectItem>
        </MultiSelect>
        <Select value={year} placeholder="Currect year" onValueChange={setYear}>
          <SelectItem value="2023">2023</SelectItem>
          <SelectItem value="2022">2022</SelectItem>
          <SelectItem value="2021">2021</SelectItem>
          <SelectItem value="2020">2020</SelectItem>
        </Select>
      </div>
      <LineChart
        className="mt-4 h-80"
        data={data}
        index="Month"
        categories={["Completed", "In Progress", "Failed"]}
        colors={["emerald", "lime", "cyan"]}
        valueFormatter={valueFormatter}
      />
    </Card>
  );
}
