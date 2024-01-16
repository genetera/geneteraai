"use client";

import React from "react";
import { useParams } from "next/navigation";
import {
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  Badge,
} from "@tremor/react";
import Text from "@/components/ui/text";

import Documents from "@/components/organization/documents";
import useSWR from "swr";

import { IOrganization } from "@/types/organization";
import OrganizationService from "@/services/organizations";
import { ORGANIZATION_DETAILS } from "@/constants/fetch-keys";

import InDevelopment from "@/components/ui/in-development";

const OrganizationDetails = () => {
  const params: { organizationId: string } = useParams();

  const {
    data: organization,
    isLoading: isOrganizationLoading,
    error: organizationError,
  } = useSWR<IOrganization>(ORGANIZATION_DETAILS(params.organizationId), () =>
    OrganizationService.getOrganization(params.organizationId)
  );

  return (
    <div>
      <div className="px-10 py-2 ">
        <div className="flex flex-row justify-between items-center">
          <Text className="text-4xl font-extrabold text-black-500">
            {organization?.name}
          </Text>
        </div>
      </div>
      <TabGroup>
        <TabList color="blue" className="px-10">
          <Tab className="text-black font-semibold">Documents</Tab>
          <Tab className="text-black font-semibold">Members</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Documents />
          </TabPanel>
          <TabPanel>
            <InDevelopment />
          </TabPanel>
        </TabPanels>
      </TabGroup>
    </div>
  );
};

export default OrganizationDetails;
