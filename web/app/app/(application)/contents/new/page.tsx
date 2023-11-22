"use client";

import React from "react";
import Link from "next/link";
import ButtonPrimary from "@/components/ui/buttons/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";

const NewContent = () => {
  return (
    <>
      <div className="px-10 py-2 ">
        <Link href="/app/contents">
          <ArrowLeftIcon className="text-black-500 w-10 h-10" />
        </Link>

        <div className="flex flex-col items-center  px-4 py-6 mt-2 lg:py-0">
          <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
            <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
              <h1 className="text-xl text-center font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Create Content
              </h1>
              <form className="space-y-4 md:space-y-6" action="#">
                <Input
                  label="Topic"
                  type="text"
                  name="firstname"
                  id="firstname"
                />
                <Input
                  label="Description"
                  type="text"
                  name="firstname"
                  id="firstname"
                />
                <Select
                  label="Organization"
                  options={[
                    { title: "Qurity", value: "tegd-gege" },
                    { title: "Vomaty", value: "5-20" },
                    { title: "Genetera", value: "20-More" },
                  ]}
                  name="organization_size"
                  id="organization_size"
                  placeholder="Org"
                  validations={{
                    required: "Organization is required",
                  }}
                />
                <Select
                  label="Project"
                  options={[
                    { title: "Qurity", value: "tegd-gege" },
                    { title: "Vomaty", value: "5-20" },
                    { title: "Genetera", value: "20-More" },
                  ]}
                  name="organization_size"
                  id="organization_size"
                  placeholder="Org"
                  validations={{
                    required: "Organization is required",
                  }}
                />
                <Select
                  label="Platform"
                  options={[
                    { title: "Qurity", value: "tegd-gege" },
                    { title: "Vomaty", value: "5-20" },
                    { title: "Genetera", value: "20-More" },
                  ]}
                  name="organization_size"
                  id="organization_size"
                  placeholder="Org"
                  validations={{
                    required: "Organization is required",
                  }}
                />
                <Select
                  label="Tone"
                  options={[
                    { title: "Qurity", value: "tegd-gege" },
                    { title: "Vomaty", value: "5-20" },
                    { title: "Genetera", value: "20-More" },
                  ]}
                  name="organization_size"
                  id="organization_size"
                  placeholder="Org"
                  validations={{
                    required: "Organization is required",
                  }}
                />
                <ButtonPrimary className="w-full">Create content</ButtonPrimary>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NewContent;
