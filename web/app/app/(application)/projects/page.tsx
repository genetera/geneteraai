"use client";
import React, { useState, useEffect } from "react";
import Text from "@/components/ui/text";
import ButtonPrimary from "@/components/ui/buttons/button";
import ButtonSecondary from "@/components/ui/buttons/button-secondary";
import { useForm, SubmitHandler } from "react-hook-form";
import { MultiSelect, MultiSelectItem } from "@tremor/react";
import { PlusCircleIcon, TrashIcon } from "@heroicons/react/24/outline";
import { toastify } from "@/helpers/toast";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import LayoutView from "@/components/ui/layout-view";

import OrganizationService from "@/services/organizations";
import ProjectService from "@/services/project";

import useSWR, { mutate } from "swr";
import Table from "@/components/ui/table";
import { IProject } from "@/types/project";
import Modal from "@/components/ui/modal";
import ContentLoader from "@/components/ui/content-loader";
import NoContent from "@/components/ui/no-content";

import { PROJECTS_LIST } from "@/constants/fetch-keys";

interface IOrganizationList {
  title: string;
  value: string;
}

const Projects = () => {
  const [organizationList, setOrganizationList] = useState<IOrganizationList[]>(
    [] as IOrganizationList[]
  );

  const [organizationFilter, setOrganizationFilter] = useState<string[]>(
    [] as string[]
  );
  const [projectDeleteShowModal, setProjectDeleteShowModal] =
    useState<boolean>(false);
  const [projectIdToDelete, setProjectIdToDelete] = useState<string>(
    "" as string
  );
  const [isProjectDeleteLoading, setIsProjectDeleteLoading] =
    useState<boolean>(false);

  const [projectCreateShowModal, setProjectCreateShowModal] =
    useState<boolean>(false);

  const projectsHeaders = ["Name", "Organization", "Created at", ""];

  const {
    data: projects,
    isLoading: isProjectsLoading,
    error: projectsError,
  } = useSWR<IProject[]>(PROJECTS_LIST, () => ProjectService.getProjects());

  const defaultValues: Partial<IProject> = {
    name: "",
    organization: "",
  };
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<Partial<IProject>>({
    defaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const openDeleteModal = (id: string) => {
    setProjectIdToDelete(id);
    setProjectDeleteShowModal(true);
  };

  const closeDeleteModal = () => {
    setProjectIdToDelete("");
    setProjectDeleteShowModal(false);
  };

  const openCreateModal = () => {
    setProjectCreateShowModal(true);
  };

  const closeCreateModal = () => {
    setProjectCreateShowModal(false);
  };

  const handleCreateProject: SubmitHandler<Partial<IProject>> = async (
    data
  ) => {
    try {
      await ProjectService.createProject(data);
      mutate<IProject[]>(PROJECTS_LIST);
      closeCreateModal();
      reset(defaultValues);
      toastify({
        icon: "success",
        title: "Project added successfully.",
      });
    } catch (error: any) {
      closeCreateModal();
      toastify({
        icon: "error",
        title: error?.error,
      });
    }
  };

  const handleDeleteProject = async () => {
    setIsProjectDeleteLoading(true);

    try {
      await ProjectService.deleteProject(projectIdToDelete);
      mutate<IProject[]>(
        PROJECTS_LIST,
        (prevData) => {
          if (!prevData) return;

          return prevData.filter((project) => project.id !== projectIdToDelete);
        },
        false
      );
      setIsProjectDeleteLoading(false);
      closeDeleteModal();
      reset(defaultValues);
      toastify({
        icon: "success",
        title: "Project deleted successfully.",
      });
    } catch (error: any) {
      setIsProjectDeleteLoading(false);
      closeDeleteModal();
      reset(defaultValues);
      toastify({
        icon: "error",
        title: error?.error,
      });
    }
  };

  useEffect(() => {
    ProjectService.getProjects(organizationFilter).then((response) => {
      mutate<IProject[]>(
        PROJECTS_LIST,
        () => {
          return response;
        },
        false
      );
    });
  }, [organizationFilter]);

  useEffect(() => {
    (async () => {
      let data = await OrganizationService.getOrganizations();
      let organizationData = data.map((organization) => ({
        title: organization.name,
        value: organization.id,
      }));
      setOrganizationList(organizationData);
    })();
  }, []);

  return (
    <>
      <div className="px-10 py-2 ">
        <div className="flex flex-row justify-between items-center">
          <Text className="text-4xl font-extrabold text-black-500">
            Projects
          </Text>
          <div className="space-x-2">
            <ButtonPrimary icon={PlusCircleIcon} onClick={openCreateModal}>
              Crete project
            </ButtonPrimary>
          </div>
        </div>
        <div className="flex justify-end w-full">
          <LayoutView />
        </div>
        <div className="mt-5 ">
          <MultiSelect
            placeholder="All organizations"
            value={organizationFilter}
            onValueChange={setOrganizationFilter}
          >
            {organizationList?.map((organization) => (
              <MultiSelectItem value={organization.value}>
                {organization.title}
              </MultiSelectItem>
            ))}
          </MultiSelect>
        </div>
        {isProjectsLoading && <ContentLoader />}
        {!isProjectsLoading && projects?.length === 0 && <NoContent />}
        {!isProjectsLoading && projects?.length !== 0 && (
          <>
            <div className="mt-5 ">
              <Table headers={projectsHeaders}>
                {projects?.map((project, indx) => (
                  <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td className="px-6 py-4 font-bold text-black whitespace-nowrap dark:text-white">
                      {project.name}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-start">
                        <div className="flex justify-center items-center bg-green-600 text-white font-semibold w-5 h-5 rounded-md">
                          {project.organization_name.charAt(0).toUpperCase()}
                        </div>
                        <span className="ml-2 font-medium">
                          {project.organization_name}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{project.created_at}</td>

                    <td className="px-6 py-4 text-right">
                      <a
                        href="#"
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        <ButtonPrimary
                          icon={TrashIcon}
                          color="rose"
                          size="xs"
                          onClick={() => openDeleteModal(project.id)}
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
        title=" Delete project"
        description={`Are you sure you want to delete project ${
          projects?.find((obj) => obj.id === projectIdToDelete)?.name
        }. Deleting this project will automatically delete all data related to it.`}
        isOpen={projectDeleteShowModal}
        handleClose={() => setProjectDeleteShowModal(false)}
      >
        <div className="flex justify-end gap-2 p-4 sm:px-6">
          <ButtonSecondary onClick={closeDeleteModal}>Cancel</ButtonSecondary>
          <ButtonPrimary
            onClick={handleDeleteProject}
            color="rose"
            loading={isProjectDeleteLoading}
          >
            Delete
          </ButtonPrimary>
        </div>
      </Modal>

      <Modal
        title=" Create Projects"
        isOpen={projectCreateShowModal}
        handleClose={() => setProjectCreateShowModal(false)}
      >
        <form
          className="space-y-4 md:space-y-6 p-4 sm:px-6"
          onSubmit={handleSubmit(handleCreateProject)}
        >
          <Select
            label="Organization"
            options={organizationList}
            register={register}
            name="organization"
            id="organization"
            validations={{
              required: "Organization is required",
            }}
            error={errors.organization}
          />
          <Input
            label="Project name"
            type="text"
            name="name"
            id="name"
            register={register}
            validations={{
              required: "Project name is required",
            }}
            error={errors.name}
          />

          <div className="flex justify-end gap-2 p-4 sm:px-6">
            <ButtonSecondary onClick={closeCreateModal}>Cancel</ButtonSecondary>
            <ButtonPrimary type="submit" color="emerald" loading={isSubmitting}>
              Create project
            </ButtonPrimary>
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Projects;
