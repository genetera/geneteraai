"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import ButtonPrimary from "@/components/ui/buttons/button";
import ButtonSecondary from "@/components/ui/buttons/button-secondary";
import useSWR from "swr";
import parse from "html-react-parser";
import { Bars, Oval, Discuss } from "react-loader-spinner";

import {
  PaperAirplaneIcon,
  ArrowDownOnSquareIcon,
  ClipboardDocumentIcon,
  SparklesIcon,
  CpuChipIcon,
  BookmarkSquareIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { toastify } from "@/helpers/toast";
import { Tooltip } from "flowbite-react";

import { IContent, IContentData } from "@/types/content";
import { CONTENT_DETAILS } from "@/constants/fetch-keys";

import ContentService from "@/services/content";
import Input from "@/components/ui/input";

import fileDownload from "js-file-download";

const ContentEditor = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDownloading, setIsDownloading] = useState<boolean>(false);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [prompt, setPrompt] = useState<string>("");

  const params: { contentId: string } = useParams();

  const {
    data: content,
    isLoading: isContentLoading,
    error: contentError,
  } = useSWR<IContent>(CONTENT_DETAILS(params.contentId), () =>
    ContentService.getContent(params.contentId)
  );

  const handleEdit = async () => {
    if (prompt === "") {
      toastify({
        icon: "error",
        title: "No prompt provided.",
      });
      return;
    }

    setIsLoading(true);

    let contentData: IContentData = {
      prompt: prompt,
      content: content?.content,
    };

    try {
      let responseData: { content: string } = await ContentService.editContent(
        params.contentId,
        contentData
      );

      if (content?.content !== undefined) {
        content.content = responseData.content;
      }

      setIsLoading(false);
    } catch (error: any) {
      setIsLoading(false);
      toastify({
        icon: "error",
        title: error?.error,
      });
    }
  };

  const handleSummarization = async () => {
    toastify({
      icon: "error",
      title: "In development",
    });
  };

  const handleRephrasing = async () => {
    toastify({
      icon: "error",
      title: "In development",
    });
  };

  const handlePromptChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrompt(e.target.value);
  };

  const downloadContent = async () => {
    try {
      setIsDownloading(true);
      const filename = content?.title + ".pdf";
      const response = await ContentService.downloadContent(params.contentId, {
        content: content?.content,
      });
      fileDownload(response, filename);
      setIsDownloading(false);
    } catch (error: any) {
      setIsDownloading(false);
      toastify({
        icon: "error",
        title: "There was error exporting content.",
      });
    }
  };

  const saveResponse = async () => {
    //Check if contect is empty.

    if (content?.content === "") {
      toastify({
        icon: "error",
        title: "No content",
      });
      return;
    }

    setIsSaving(true);

    let data = { content: content?.content };

    try {
      await ContentService.saveContentResponse(params.contentId, data);
      setIsSaving(false);
      toastify({
        icon: "success",
        title: "Content saved successfully.",
      });
    } catch (error: any) {
      setIsSaving(false);
      toastify({
        icon: "error",
        title: error?.error,
      });
    }
  };
  return (
    <>
      <div className="px-10 py-2 h-80">
        <div className="flex justify-between items-center mb-3 px-6">
          <Link href="/app/contents/">
            <div className="bg-gray-900 rounded-full border border-gray-100 w-10 h-10 text-white font-bold flex justify-center items-center">
              <ArrowLeftIcon className="w-4 h-4" />
            </div>
          </Link>
          <div>
            <h2 className="font-extrabold text-gray-600">
              {content?.title.toUpperCase()}
            </h2>
          </div>
          <div className="flex flex-row">
            <Tooltip content="Save response" placement="bottom">
              <ButtonSecondary
                {...(isSaving ? {} : { icon: BookmarkSquareIcon })}
                size="xs"
                onClick={saveResponse}
              >
                {isSaving && (
                  <Oval
                    height={15}
                    width={15}
                    color="#000"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                    ariaLabel="oval-loading"
                    secondaryColor="#e5e7eb"
                    strokeWidth={2}
                    strokeWidthSecondary={2}
                  />
                )}
              </ButtonSecondary>
            </Tooltip>
            <Tooltip content="Export response" placement="bottom">
              <ButtonSecondary
                {...(isDownloading ? {} : { icon: ArrowDownOnSquareIcon })}
                size="xs"
                className="ml-2"
                onClick={downloadContent}
              >
                {isDownloading && (
                  <Oval
                    height={15}
                    width={15}
                    color="#000"
                    wrapperStyle={{}}
                    wrapperClass=""
                    visible={true}
                    ariaLabel="oval-loading"
                    secondaryColor="#e5e7eb"
                    strokeWidth={2}
                    strokeWidthSecondary={2}
                  />
                )}
              </ButtonSecondary>
            </Tooltip>
          </div>
        </div>
        <div className="markdown focus:outline-none font-normal text-gray-700 w-100 h-80 rounded-xl px-32 py-6 overflow-auto no-scrollbar">
          {isLoading && (
            <div className="w-full h-full flex justify-center items-center">
              <Discuss
                visible={true}
                height="80"
                width="80"
                ariaLabel="discuss-loading"
                wrapperStyle={{}}
                wrapperClass="discuss-wrapper"
                colors={["#000", "#000"]}
              />
            </div>
          )}

          {!isLoading &&
            (content?.content.length ? parse(content?.content) : "")}
        </div>
        <div className="p-6 mt-2">
          <Input
            disabled={isLoading}
            type="text"
            name="prompt"
            id="prompt"
            placeholder="Write prompt here.."
            onChange={handlePromptChange}
            className="border border-gray-300 overflow-y-hidden break-words h-14 shadow-none focus:outline-none"
            autoComplete="off"
          />

          <div className="flex justify-start">
            <ButtonPrimary
              icon={CpuChipIcon}
              size="xs"
              className="mt-2 bg-black border-black"
              onClick={handleSummarization}
            >
              Summarize
            </ButtonPrimary>
            <ButtonPrimary
              icon={SparklesIcon}
              size="xs"
              className="mt-2 ml-2 bg-black border-black"
              onClick={handleRephrasing}
            >
              Rephrase
            </ButtonPrimary>
            <ButtonPrimary
              {...(isLoading ? {} : { icon: PaperAirplaneIcon })}
              disabled={isLoading}
              size="xs"
              className="mt-2 ml-2 bg-black border-black"
              onClick={handleEdit}
            >
              {isLoading && (
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
              )}
            </ButtonPrimary>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContentEditor;
