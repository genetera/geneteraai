"use client";

import React, { useState } from "react";
import { useParams } from "next/navigation";
import Table from "../ui/table";
import ButtonPrimary from "../ui/buttons/button";
import ButtonSecondary from "../ui/buttons/button-secondary";
import { TrashIcon, DocumentCheckIcon } from "@heroicons/react/24/outline";
import useSWR, { mutate } from "swr";
import Modal from "@/components/ui/modal";
import ContentLoader from "@/components/ui/content-loader";
import NoContent from "@/components/ui/no-content";
import { toastify } from "@/helpers/toast";

import LayoutView from "../ui/layout-view";
import OrganizationService from "@/services/organizations";

import { IDocument } from "@/types/organization";
import { ORGANIZATION_DOCUMENTS_LIST } from "@/constants/fetch-keys";

const DocumentList = () => {
  const params: { organizationId: string } = useParams();

  const [documentDeleteShowModal, setDocumentDeleteShowModal] =
    useState<boolean>(false);
  const [documentIdToDelete, setDocumentIdToDelete] = useState<string>(
    "" as string
  );
  const [isDocumentDeleteLoading, setIsDocumentDeleteLoading] =
    useState<boolean>(false);

  const {
    data: documents,
    isLoading: isDocumentsLoading,
    error: documentsError,
  } = useSWR<IDocument[]>(ORGANIZATION_DOCUMENTS_LIST, () =>
    OrganizationService.getOrganizationDocuments(params.organizationId)
  );

  const openDeleteModal = (id: string) => {
    setDocumentIdToDelete(id);
    setDocumentDeleteShowModal(true);
  };

  const closeDeleteModal = () => {
    setDocumentIdToDelete("");
    setDocumentDeleteShowModal(false);
  };

  const handleDeleteDocument = async () => {
    setIsDocumentDeleteLoading(true);

    try {
      await OrganizationService.deleteOrganizationDocument(
        params.organizationId,
        documentIdToDelete
      );
      mutate<IDocument[]>(
        ORGANIZATION_DOCUMENTS_LIST,
        (prevData) => {
          if (!prevData) return;

          return prevData.filter(
            (document) => document.id !== documentIdToDelete
          );
        },
        false
      );
      setIsDocumentDeleteLoading(false);
      closeDeleteModal();
      toastify({
        icon: "success",
        title: "Deleted successfully.",
      });
    } catch (error: any) {
      setIsDocumentDeleteLoading(false);
      closeDeleteModal();
      toastify({
        icon: "error",
        title: error?.error,
      });
    }
  };
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-semibold mt-4">Documents</h2>
        <LayoutView />
      </div>
      {isDocumentsLoading && <ContentLoader />}
      {!isDocumentsLoading && documents?.length === 0 && <NoContent />}

      {!isDocumentsLoading && documents?.length !== 0 && (
        <>
          <div className="mt-5 ">
            <Table headers={["Name", "Size", ""]}>
              {documents?.map((document, indx) => (
                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                  <td className="px-6 py-4">
                    <div className="flex justify-start items-center cursor-pointer">
                      <div className="bg-black p-1 rounded flex justify-center items-center font-bold text-white w-5 h-5">
                        <DocumentCheckIcon className="w-20" />
                      </div>
                      <span className="ml-2 text-black font-semibold">
                        {document.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-semibold text-black">
                    {document.size}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <a
                      href="#"
                      className="font-medium text-blue-600 ml-2 dark:text-blue-500 hover:underline"
                    >
                      <ButtonPrimary
                        icon={TrashIcon}
                        color="rose"
                        size="xs"
                        onClick={() => openDeleteModal(document.id)}
                      ></ButtonPrimary>
                    </a>
                  </td>
                </tr>
              ))}
            </Table>
          </div>
        </>
      )}

      {documentsError?.detail ? (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">WARNING: </strong>
          <span className="block sm:inline">{documentsError?.detail}</span>
        </div>
      ) : (
        ""
      )}

      <Modal
        title=" Delete Document"
        description={`Are you sure you want to delete document ${
          documents?.find((obj) => obj.id === documentIdToDelete)?.name
        }.`}
        isOpen={documentDeleteShowModal}
        handleClose={() => setDocumentDeleteShowModal(false)}
      >
        <div className="flex justify-end gap-2 p-4 sm:px-6">
          <ButtonSecondary onClick={closeDeleteModal}>Cancel</ButtonSecondary>
          <ButtonPrimary
            onClick={handleDeleteDocument}
            color="rose"
            loading={isDocumentDeleteLoading}
          >
            Delete
          </ButtonPrimary>
        </div>
      </Modal>
    </div>
  );
};

export default DocumentList;
