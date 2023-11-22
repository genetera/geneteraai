"use client";
import { useState } from "react";
import {
  Card,
  Title,
  Grid,
  Col,
  Flex,
  BadgeDelta,
  Metric,
  Button,
} from "@tremor/react";
import { PlusCircleIcon, BriefcaseIcon } from "@heroicons/react/24/outline";
import { LineChartInteractiveExample } from "@/components/dashboard/area-chart";
import TableData from "@/components/dashboard/table";
import Bar from "@/components/dashboard/bar-chat";
import Text from "@/components/ui/text";
import { MultiSelect, MultiSelectItem } from "@tremor/react";
export default function Dashboard() {
  const [selectValue, setSelectValue] = useState<string[]>([] as string[]);
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
        <Grid numItemsLg={6} className="gap-6 mt-6">
          {/* KPI sidebar */}
          <Col numColSpanLg={2}>
            <div className="space-y-6">
              <Card className="shadow-none">
                <Flex alignItems="start">
                  <Text className="font-semibold">Request</Text>
                  <BadgeDelta deltaType="moderateIncrease">18%</BadgeDelta>
                </Flex>
                <Flex
                  justifyContent="start"
                  alignItems="baseline"
                  className="truncate space-x-3"
                >
                  <Metric className="font-bold">546</Metric>
                  <Text className="truncate">from 786</Text>
                </Flex>
              </Card>
              <Card className="shadow-none">
                <Flex alignItems="start">
                  <Text className="font-semibold">Modules</Text>
                  <BadgeDelta deltaType="moderateIncrease">57</BadgeDelta>
                </Flex>
                <Flex
                  justifyContent="start"
                  alignItems="baseline"
                  className="truncate space-x-3"
                >
                  <Metric className="font-bold">546</Metric>
                  <Text className="truncate">from 786</Text>
                </Flex>
              </Card>
              <Card className="shadow-none">
                <Flex alignItems="start">
                  <Text className="font-semibold">Tasks</Text>
                  <BadgeDelta deltaType="moderateDecrease">21</BadgeDelta>
                </Flex>
                <Flex
                  justifyContent="start"
                  alignItems="baseline"
                  className="truncate space-x-3"
                >
                  <Metric className="font-bold">51246</Metric>
                  <Text className="truncate">from 786</Text>
                </Flex>
              </Card>
            </div>
          </Col>

          {/* Main section */}
          <Col numColSpanLg={4}>
            <Card className="shadow-none h-full">
              <LineChartInteractiveExample />
            </Card>
          </Col>
        </Grid>
        <div className="py-5">
          <Bar />
        </div>
        <div className="">
          <Text className="font-semibold">Contents</Text>
        </div>
        <div className="mt-5 ">
          <TableData />
        </div>
      </div>
    </>
  );
}
