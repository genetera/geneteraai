"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Text from "@/components/ui/text";
import ButtonPrimary from "@/components/ui/buttons/button";
import ButtonSecondary from "@/components/ui/buttons/button-secondary";
import { useForm, SubmitHandler } from "react-hook-form";
import {
  Badge,
  Select,
  SelectItem,
  MultiSelect,
  MultiSelectItem,
} from "@tremor/react";
import {
  PlusCircleIcon,
  TrashIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { Toast } from "@/helpers/toast";
import Input from "@/components/ui/input";
import SelectInput from "@/components/ui/select";
import OrganizationService from "@/services/organizations";
import useSWR, { mutate } from "swr";
import Table from "@/components/ui/table";
import { IOrganization } from "@/types/organization";
import Modal from "@/components/ui/modal";

import { ORGANIZATIONS_LIST } from "@/constants/fetch-keys";

const Contents = () => {
  const [organization, setOrganization] = useState<string[]>([] as string[]);
  const [projects, setProjects] = useState<string[]>([] as string[]);
  const [year, setYear] = useState<string>("");
  const [orgDeleteShowModal, setOrgDeleteShowModal] = useState<boolean>(false);
  const [orgIdToDelete, setOrgIdToDelete] = useState<string>("" as string);
  const [isOrgDeleteLoading, setIsOrgDeleteLoading] = useState<boolean>(false);

  const [orgCreateShowModal, setOrgCreateShowModal] = useState<boolean>(false);

  const organizationsHeaders = [
    "Organization",
    "Size",
    "Role",
    "Created at",
    "",
  ];

  const {
    data: organizations,
    isLoading: isOrganizationsLoading,
    error: organizationsError,
  } = useSWR<IOrganization[]>(ORGANIZATIONS_LIST, () =>
    OrganizationService.getOrganizations()
  );

  const defaultValues: Partial<IOrganization> = {
    name: "",
    organization_size: "",
  };
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<Partial<IOrganization>>({
    defaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const openDeleteModal = (id: string) => {
    setOrgIdToDelete(id);
    setOrgDeleteShowModal(true);
  };

  const closeDeleteModal = () => {
    setOrgIdToDelete("");
    setOrgDeleteShowModal(false);
  };

  const openCreateModal = () => {
    setOrgCreateShowModal(true);
  };

  const closeCreateModal = () => {
    setOrgCreateShowModal(false);
  };

  const handleCreateOrganization: SubmitHandler<
    Partial<IOrganization>
  > = async (data) => {
    try {
      await OrganizationService.createOrganization(data);
      mutate<IOrganization[]>(ORGANIZATIONS_LIST);
      closeCreateModal();
      reset(defaultValues);
      Toast.fire({
        icon: "success",
        title: "Added successfully.",
      });
    } catch (error: any) {
      closeCreateModal();
      Toast.fire({
        icon: "error",
        title: error?.error,
      });
    }
  };

  const handleDeleteOrganization = async () => {
    setIsOrgDeleteLoading(true);

    try {
      await OrganizationService.deleteOrganization(orgIdToDelete);
      mutate<IOrganization[]>(
        ORGANIZATIONS_LIST,
        (prevData) => {
          if (!prevData) return;

          return prevData.filter(
            (organization) => organization.id !== orgIdToDelete
          );
        },
        false
      );
      setIsOrgDeleteLoading(false);
      closeDeleteModal();
      reset(defaultValues);
      Toast.fire({
        icon: "success",
        title: "Deleted successfully.",
      });
    } catch (error: any) {
      setIsOrgDeleteLoading(false);
      closeDeleteModal();
      reset(defaultValues);
      Toast.fire({
        icon: "error",
        title: error?.error,
      });
    }
  };

  return (
    <>
      <div className="px-10 py-2 ">
        <div className="flex flex-row justify-between items-center">
          <Text className="text-4xl font-extrabold text-black-500">
            Contents
          </Text>
          <div className="space-x-2">
            <Link href="/app/contents/new">
              <ButtonPrimary icon={PlusCircleIcon}>Crete content</ButtonPrimary>
            </Link>
          </div>
        </div>
        <div className="flex gap-2 mt-4 mb-2">
          <MultiSelect
            placeholder="All organizations"
            value={organization}
            onValueChange={setOrganization}
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
            value={organization}
            onValueChange={setOrganization}
          >
            <MultiSelectItem value="1">Genetera</MultiSelectItem>
            <MultiSelectItem value="2">Vomaty</MultiSelectItem>
            <MultiSelectItem value="3">Quintify</MultiSelectItem>
            <MultiSelectItem value="4">FFCO</MultiSelectItem>
          </MultiSelect>
          <Select
            value={year}
            placeholder="Currect year"
            onValueChange={setYear}
          >
            <SelectItem value="2023">2023</SelectItem>
            <SelectItem value="2022">2022</SelectItem>
            <SelectItem value="2021">2021</SelectItem>
            <SelectItem value="2020">2020</SelectItem>
          </Select>
        </div>

        <div className="mt-5 ">
          <Table headers={organizationsHeaders}>
            {organizations?.map((organization, indx) => (
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-6 py-4 font-bold text-black whitespace-nowrap dark:text-white">
                  {organization.name}
                </td>
                <td className="px-6 py-4">{organization.organization_size}</td>
                <td className="px-6 py-4">
                  <Badge size="xs" color="green">
                    Owner
                  </Badge>
                </td>
                <td className="px-6 py-4">{organization.created_at}</td>

                <td className="px-6 py-4 text-right">
                  <a
                    href="#"
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    <ButtonSecondary icon={EyeIcon} size="xs" />
                  </a>
                  <a
                    href="#"
                    className="font-medium ml-2 text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    <ButtonPrimary
                      icon={TrashIcon}
                      color="rose"
                      size="xs"
                      onClick={() => openDeleteModal(organization.id)}
                    ></ButtonPrimary>
                  </a>
                </td>
              </tr>
            ))}
            {organizations?.map((organization, indx) => (
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-6 py-4 font-bold text-black whitespace-nowrap dark:text-white">
                  {organization.name}
                </td>
                <td className="px-6 py-4">{organization.organization_size}</td>
                <td className="px-6 py-4">
                  <Badge size="xs" color="green">
                    Owner
                  </Badge>
                </td>
                <td className="px-6 py-4">{organization.created_at}</td>

                <td className="px-6 py-4 text-right">
                  <a
                    href="#"
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    <ButtonSecondary icon={EyeIcon} size="xs" />
                  </a>
                  <a
                    href="#"
                    className="font-medium ml-2 text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    <ButtonPrimary
                      icon={TrashIcon}
                      color="rose"
                      size="xs"
                      onClick={() => openDeleteModal(organization.id)}
                    ></ButtonPrimary>
                  </a>
                </td>
              </tr>
            ))}
            {organizations?.map((organization, indx) => (
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-6 py-4 font-bold text-black whitespace-nowrap dark:text-white">
                  {organization.name}
                </td>
                <td className="px-6 py-4">{organization.organization_size}</td>
                <td className="px-6 py-4">
                  <Badge size="xs" color="green">
                    Owner
                  </Badge>
                </td>
                <td className="px-6 py-4">{organization.created_at}</td>

                <td className="px-6 py-4 text-right">
                  <a
                    href="#"
                    className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    <ButtonSecondary icon={EyeIcon} size="xs" />
                  </a>
                  <a
                    href="#"
                    className="font-medium ml-2 text-blue-600 dark:text-blue-500 hover:underline"
                  >
                    <ButtonPrimary
                      icon={TrashIcon}
                      color="rose"
                      size="xs"
                      onClick={() => openDeleteModal(organization.id)}
                    ></ButtonPrimary>
                  </a>
                </td>
              </tr>
            ))}
          </Table>
        </div>
      </div>
      <Modal
        title=" Delete Organization"
        description={`Are you sure you want to delete organization ${
          organizations?.find((obj) => obj.id === orgIdToDelete)?.name
        }. Deleting this organization will automatically delete all data related to it.`}
        isOpen={orgDeleteShowModal}
        handleClose={() => setOrgDeleteShowModal(false)}
      >
        <div className="flex justify-end gap-2 p-4 sm:px-6">
          <ButtonSecondary onClick={closeDeleteModal}>Cancel</ButtonSecondary>
          <ButtonPrimary
            onClick={handleDeleteOrganization}
            color="rose"
            loading={isOrgDeleteLoading}
          >
            Delete
          </ButtonPrimary>
        </div>
      </Modal>

      <Modal
        title=" Create Organization"
        isOpen={orgCreateShowModal}
        handleClose={() => setOrgCreateShowModal(false)}
      >
        <form
          className="space-y-4 md:space-y-6 p-4 sm:px-6"
          onSubmit={handleSubmit(handleCreateOrganization)}
        >
          <Input
            label="Organization name"
            type="text"
            name="name"
            id="name"
            register={register}
            validations={{
              required: "Organization name is required",
            }}
            error={errors.name}
          />
          <SelectInput
            label="Organization size"
            options={[
              { title: "1-5 people", value: "1-5" },
              { title: "5-20 people", value: "5-20" },
              { title: "20-More people", value: "20-More" },
            ]}
            register={register}
            name="organization_size"
            id="organization_size"
            validations={{
              required: "Organization size is required",
            }}
            error={errors.organization_size}
          />
          <div className="flex justify-end gap-2 p-4 sm:px-6">
            <ButtonSecondary onClick={closeCreateModal}>Cancel</ButtonSecondary>
            <ButtonPrimary type="submit" color="emerald" loading={isSubmitting}>
              Create organization
            </ButtonPrimary>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Contents;
