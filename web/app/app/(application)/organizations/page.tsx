"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Text from "@/components/ui/text";
import ButtonPrimary from "@/components/ui/buttons/button";
import ButtonSecondary from "@/components/ui/buttons/button-secondary";
import { useForm, SubmitHandler } from "react-hook-form";
import { Badge } from "@tremor/react";
import {
  PlusCircleIcon,
  TrashIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { toastify } from "@/helpers/toast";
import LayoutView from "@/components/ui/layout-view";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import OrganizationService from "@/services/organizations";
import useSWR, { mutate } from "swr";
import Table from "@/components/ui/table";
import { IOrganization } from "@/types/organization";
import Modal from "@/components/ui/modal";
import ContentLoader from "@/components/ui/content-loader";
import NoContent from "@/components/ui/no-content";

import { ORGANIZATIONS_LIST } from "@/constants/fetch-keys";

const Organizations = () => {
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
      toastify({
        icon: "success",
        title: "Added successfully.",
      });
    } catch (error: any) {
      closeCreateModal();
      toastify({
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
      toastify({
        icon: "success",
        title: "Deleted successfully.",
      });
    } catch (error: any) {
      setIsOrgDeleteLoading(false);
      closeDeleteModal();
      reset(defaultValues);
      toastify({
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
            Organizations
          </Text>
          <div className="space-x-2">
            <ButtonPrimary icon={PlusCircleIcon} onClick={openCreateModal}>
              Crete organization
            </ButtonPrimary>
          </div>
        </div>

        <LayoutView />
        {isOrganizationsLoading && <ContentLoader />}
        {!isOrganizationsLoading && organizations?.length === 0 && (
          <NoContent />
        )}
        {!isOrganizationsLoading && organizations?.length !== 0 && (
          <>
            <div className="mt-5 ">
              <Table headers={organizationsHeaders}>
                {organizations?.map((organization, indx) => (
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 cursor-pointer hover:bg-slate-100">
                    <td className="px-6 py-4 font-bold text-black whitespace-nowrap dark:text-white">
                      {organization.name}
                    </td>
                    <td className="px-6 py-4">
                      {organization.organization_size}
                    </td>
                    <td className="px-6 py-4">
                      <Badge size="xs" color="green">
                        Owner
                      </Badge>
                    </td>
                    <td className="px-6 py-4">{organization.created_at}</td>

                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/app/organizations/${organization.id}`}
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        <ButtonSecondary icon={EyeIcon} size="xs" />
                      </Link>
                      <a
                        href="#"
                        className="font-medium text-blue-600 ml-2 dark:text-blue-500 hover:underline"
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
          </>
        )}
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
          <Select
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

export default Organizations;
