"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Text from "@/components/ui/text";
import ButtonPrimary from "@/components/ui/buttons/button";
import ButtonSecondary from "@/components/ui/buttons/button-secondary";
import {
  PlusCircleIcon,
  TrashIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import { toastify } from "@/helpers/toast";
import LayoutView from "@/components/ui/layout-view";

import useSWR, { mutate } from "swr";
import Table from "@/components/ui/table";
import { IContent } from "@/types/content";
import Modal from "@/components/ui/modal";
import NoContent from "@/components/ui/no-content";
import ContentLoader from "@/components/ui/content-loader";

import ContentService from "@/services/content";

import ContentsFilter from "@/components/content/contents-filter";
import { SocialIcon } from "react-social-icons";

import { CONTENTS_LIST } from "@/constants/fetch-keys";

const Contents = () => {
  const [contentDeleteShowModal, setContentDeleteShowModal] =
    useState<boolean>(false);
  const [contentIdToDelete, setContentIdToDelete] = useState<string>(
    "" as string
  );
  const [isContentDeleteLoading, setIsContentDeleteLoading] =
    useState<boolean>(false);

  const [filterParams, setFilterParams] = useState<string>("");

  const contentsHeaders = ["Title", "Category", "Platform", ""];

  const {
    data: contents,
    isLoading: isContentsLoading,
    error: contentsError,
  } = useSWR<IContent[]>(CONTENTS_LIST, () => ContentService.getContents());

  const openDeleteModal = (id: string) => {
    setContentIdToDelete(id);
    setContentDeleteShowModal(true);
  };

  const closeDeleteModal = () => {
    setContentIdToDelete("");
    setContentDeleteShowModal(false);
  };

  const handleDeleteContent = async () => {
    setIsContentDeleteLoading(true);

    try {
      await ContentService.deleteContent(contentIdToDelete);
      mutate<IContent[]>(
        CONTENTS_LIST,
        (prevData) => {
          if (!prevData) return;

          return prevData.filter((content) => content.id !== contentIdToDelete);
        },
        false
      );
      setIsContentDeleteLoading(false);
      closeDeleteModal();

      toastify({
        icon: "success",
        title: "Deleted successfully.",
      });
    } catch (error: any) {
      setIsContentDeleteLoading(false);
      closeDeleteModal();
      toastify({
        icon: "error",
        title: error?.error,
      });
    }
  };

  useEffect(() => {
    ContentService.getContents(filterParams).then((response) => {
      mutate<IContent[]>(
        CONTENTS_LIST,
        () => {
          return response;
        },
        false
      );
    });
  }, [filterParams]);

  return (
    <>
      <div className="px-10 py-2 container-dotted ">
        <div className="flex flex-row justify-between items-center">
          <Text className="text-4xl font-extrabold text-black-500">
            Contents
          </Text>
          <div className="space-x-2">
            <Link href="/app/contents/new">
              <ButtonPrimary icon={PlusCircleIcon}>
                Create content
              </ButtonPrimary>
            </Link>
          </div>
        </div>

        <LayoutView />
        <ContentsFilter setFilterParams={setFilterParams} />
        {isContentsLoading && <ContentLoader />}
        {!isContentsLoading && contents?.length === 0 && <NoContent />}
        {!isContentsLoading && contents?.length !== 0 && (
          <div className="mt-5">
            <Table headers={contentsHeaders}>
              {contents?.map((content, indx) => (
                <tr
                  key={indx}
                  className=" bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <td className="px-6 py-4  whitespace-nowrap dark:text-white">
                    <Link href={`/app/contents/${content.id}`}>
                      <span className="font-bold text-black">
                        {content.title}
                      </span>
                    </Link>
                  </td>
                  <td className="px-6 py-4">{content.category.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <SocialIcon
                        url={content.platform.url}
                        className="mr-1"
                        style={{
                          width: "22px",
                          height: "22px",
                        }}
                        bgColor="black"
                        color="white"
                      />
                      {content.platform.name}
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <a
                      href="#"
                      className="font-medium ml-2 text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      <Link
                        href={`/app/contents/${content.id}`}
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        <ButtonSecondary icon={EyeIcon} size="xs" />
                      </Link>
                      <ButtonPrimary
                        className="ml-2"
                        icon={TrashIcon}
                        color="rose"
                        size="xs"
                        onClick={() => openDeleteModal(content.id)}
                      ></ButtonPrimary>
                    </a>
                  </td>
                </tr>
              ))}
            </Table>
          </div>
        )}
      </div>
      <Modal
        title=" Delete Content"
        description={`Are you sure you want to delete content ${
          contents?.find((obj) => obj.id === contentIdToDelete)?.title
        }.`}
        isOpen={contentDeleteShowModal}
        handleClose={() => setContentDeleteShowModal(false)}
      >
        <div className="flex justify-end gap-2 p-4 sm:px-6">
          <ButtonSecondary onClick={closeDeleteModal}>Cancel</ButtonSecondary>
          <ButtonPrimary
            onClick={handleDeleteContent}
            color="rose"
            loading={isContentDeleteLoading}
          >
            Delete
          </ButtonPrimary>
        </div>
      </Modal>
    </>
  );
};

export default Contents;
