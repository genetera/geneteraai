import React, { useCallback, useState } from "react";
import { useParams } from "next/navigation";
import { DocumentPlusIcon } from "@heroicons/react/24/outline";
import DocumentList from "./documents-list";
import { NextPage } from "next";
import { useDropzone } from "react-dropzone";
import { mutate } from "swr";

import { toastify } from "@/helpers/toast";
import { Oval } from "react-loader-spinner";

import OrganizationService from "@/services/organizations";
import { IDocument } from "@/types/organization";
import { ORGANIZATION_DOCUMENTS_LIST } from "@/constants/fetch-keys";

const Documents: NextPage = () => {
  const params: { organizationId: string } = useParams();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const uploadDoc = async (file: any) => {
    try {
      setIsLoading(true);
      const document = await OrganizationService.uploadOrganizationDocument(
        params.organizationId,
        file
      );

      mutate<IDocument[]>(
        ORGANIZATION_DOCUMENTS_LIST,
        (prevData) => {
          return [
            { id: document.id, name: document.name, size: document.size },
            ...(prevData as []),
          ];
        },
        false
      );
      toastify({
        icon: "success",
        title: "Document uploaded successfully.",
      });
      setIsLoading(false);
    } catch (error: any) {
      toastify({
        icon: "error",
        title: error.error,
      });
      setIsLoading(false);
    }
  };
  const onDrop = useCallback((acceptedFiles: any) => {
    uploadDoc(acceptedFiles);
  }, []);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
  });

  return (
    <div className="px-10 py-2 ">
      <div
        {...getRootProps()}
        className="w-100 h-28 flex justify-center items-center rounded-md border-dashed cursor-pointer border-gray-600 border-2"
      >
        <div>
          <input {...getInputProps()} />
          {isDragActive ? (
            <p>Drop the files here ...</p>
          ) : (
            <div className="flex flex-col items-center">
              {isLoading ? (
                <Oval
                  height={50}
                  width={50}
                  color="#000000"
                  wrapperStyle={{}}
                  wrapperClass=""
                  visible={true}
                  ariaLabel="oval-loading"
                  secondaryColor="#e5e7eb"
                  strokeWidth={2}
                  strokeWidthSecondary={2}
                />
              ) : (
                <>
                  <div className="bg-gray-200 flex justify-center items-center w-10 h-10 rounded-md">
                    <DocumentPlusIcon className="w-5 h-5 text-gray-800" />
                  </div>
                  <span className="font-bold text-sm mt-2">
                    Upload Document
                  </span>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div>
        <DocumentList />
      </div>
    </div>
  );
};

export default Documents;
