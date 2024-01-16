"use client";

import React, { useState, useEffect } from "react";
import Text from "@/components/ui/text";
import ButtonPrimary from "@/components/ui/buttons/button";
import InputDescription from "@/components/ui/input-description";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";
import { toastify } from "@/helpers/toast";
import { useForm, SubmitHandler } from "react-hook-form";

import OrganizationService from "@/services/organizations";
import ProjectService from "@/services/project";
import ContentSevice from "@/services/content";
import {
  ICreateContent,
  IContentCategory,
  IContentPlatform,
  IContentEmotion,
} from "@/types/content";

import { IOrganization } from "@/types/organization";
import { IProject } from "@/types/project";

import { Oval } from "react-loader-spinner";

const NewContent = () => {
  const defaultValues: Partial<ICreateContent> = {
    title: "",
    organization: "",
    project: "",
    platform: "",
    category: "",
    emotion: "",
  };
  const {
    register,
    handleSubmit,
    reset,
    setError,
    watch,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<ICreateContent>({
    defaultValues,
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const organizationValue = watch("organization");

  const [organizations, setOrganizations] = useState<IOrganization[]>(
    [] as IOrganization[]
  );
  const [projects, setProjects] = useState<IProject[]>([] as IProject[]);
  const [categories, setCategories] = useState<IContentCategory[]>(
    [] as IContentCategory[]
  );
  const [platforms, setPlatforms] = useState<IContentPlatform[]>(
    [] as IContentPlatform[]
  );
  const [emeotions, setEmotions] = useState<IContentEmotion[]>(
    [] as IContentEmotion[]
  );

  const createContentHandler: SubmitHandler<ICreateContent> = async (data) => {
    console.log(data);
    try {
      await ContentSevice.createContent(data);
      toastify({
        icon: "success",
        title: "Content created successfully.",
      });
      reset(defaultValues);
    } catch (error: any) {
      toastify({
        icon: "error",
        title: error?.error,
      });
    }
  };

  useEffect(() => {
    (async () => {
      let [organisations, categories, platforms, emotions] = await Promise.all([
        OrganizationService.getOrganizations(),
        ContentSevice.getContentCategories(),
        ContentSevice.getContentPlatforms(),
        ContentSevice.getContentEmotions(),
      ]);
      setOrganizations(organisations);
      setCategories(categories);
      setPlatforms(platforms);
      setEmotions(emotions);
    })();
  }, []);

  useEffect(() => {
    if (organizations.length === 0) {
      setProjects([]);
      return;
    }

    (async () => {
      let projects = await ProjectService.getProjects([organizationValue]);
      setProjects(projects);
    })();
  }, [organizationValue]);
  return (
    <>
      <div className="px-10 py-2 container-dotted ">
        <div className="flex flex-row justify-center">
          <Text className="text-2xl font-extrabold text-gray-800">
            Create content
          </Text>
        </div>

        <div className="flex justify-center  mt-2 lg:py-0">
          <div className="w-full sm:max-w-md xl:p-0 ">
            <div className="">
              <form
                className="space-y-4 md:space-y-6 mb-4"
                onSubmit={handleSubmit(createContentHandler)}
              >
                <div className="form-group">
                  <InputDescription
                    label="Title"
                    description="Write user-friendly title that will be shown in user
                    interfaces."
                  />
                  <Input
                    type="text"
                    name="title"
                    id="title"
                    register={register}
                    validations={{
                      required: "Title is required",
                    }}
                    error={errors.title}
                  />
                </div>
                <div className="form-group">
                  <InputDescription
                    label="Organization"
                    description="Select organization in which the content belongs to."
                  />
                  <Select
                    options={organizations?.map((organization) => ({
                      title: organization.name,
                      value: organization.id,
                    }))}
                    name="organization"
                    id="organization"
                    register={register}
                    validations={{
                      required: "Organization is required",
                    }}
                    error={errors.organization}
                  />
                </div>
                <div className="form-group">
                  <InputDescription
                    label="Project"
                    description="Select project in which the content belongs to."
                  />
                  <Select
                    options={projects?.map((project) => ({
                      title: project.name,
                      value: project.id,
                    }))}
                    name="project"
                    id="project"
                    register={register}
                    validations={{
                      required: "Project is required",
                    }}
                    error={errors.project}
                  />
                </div>
                <div className="form-group">
                  <InputDescription
                    label="Platform"
                    description="Select platform for the content."
                  />
                  <Select
                    options={platforms?.map((platform) => ({
                      title: platform.name,
                      value: platform.id,
                    }))}
                    name="platform"
                    id="platform"
                    register={register}
                    validations={{
                      required: "Platform is required",
                    }}
                    error={errors.platform}
                  />
                </div>
                <div className="form-group">
                  <InputDescription
                    label="Category"
                    description="Select category in which the content belongs to."
                  />
                  <Select
                    options={categories?.map((category) => ({
                      title: category.name,
                      value: category.id,
                    }))}
                    name="category"
                    id="category"
                    register={register}
                    validations={{
                      required: "Category is required",
                    }}
                    error={errors.category}
                  />
                </div>
                <div className="form-group">
                  <InputDescription
                    label="Emotion"
                    description="Select emotion for the content."
                  />
                  <Select
                    options={emeotions?.map((emotion) => ({
                      title: emotion.name,
                      value: emotion.id,
                    }))}
                    name="emotion"
                    id="emotion"
                    register={register}
                    validations={{
                      required: "Emotion is required",
                    }}
                    error={errors.emotion}
                  />
                </div>

                <div className="form-group">
                  <InputDescription
                    label="Description"
                    description="Describe what content you want AI to generate. <br /> Please
                    write as much information as possible to get accurate
                    result."
                  />
                  <Textarea
                    name="description"
                    id="description"
                    register={register}
                    validations={{
                      required: "Description is required",
                    }}
                    error={errors.description}
                  />
                </div>

                <ButtonPrimary disabled={isSubmitting}>
                  {!isSubmitting ? (
                    "Generate content"
                  ) : (
                    <div className="flex items-center">
                      <span className="mr-2">Generating....</span>
                      <Oval
                        height={20}
                        width={20}
                        color="#fff"
                        wrapperStyle={{}}
                        wrapperClass=""
                        visible={true}
                        ariaLabel="oval-loading"
                        secondaryColor="#e5e7eb"
                        strokeWidth={2}
                        strokeWidthSecondary={2}
                      />
                    </div>
                  )}
                </ButtonPrimary>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewContent;
