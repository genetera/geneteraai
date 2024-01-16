"use client";

import React from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  ChartPieIcon,
  BriefcaseIcon,
  BellIcon,
  BuildingOffice2Icon,
  ArrowLeftOnRectangleIcon,
  RectangleGroupIcon,
  ChevronUpDownIcon,
  QueueListIcon,
} from "@heroicons/react/24/outline";
import AuthenticationService from "@/services/authentication";
import Cookies from "js-cookie";
import { toastify } from "@/helpers/toast";

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const signOutHandler = async () => {
    try {
      await AuthenticationService.signOut({
        refresh_token: Cookies.get("refreshToken") as string,
      });
      toastify({
        icon: "success",
        title: "Signed out.",
      });
      window.location.href = "/app/sign-in";
    } catch (error: any) {
      toastify({
        icon: "error",
        title: "Failed try again.",
      });
    }
  };
  return (
    <>
      <aside
        id="logo-sidebar"
        className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
        aria-label="Sidebar"
      >
        <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                href="/app/dashboard/"
                className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                  pathname.startsWith("/app/dashboard") ? "active" : ""
                }`}
              >
                <ChartPieIcon className="w-5 h-5  transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />

                <span className="ml-3">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                href="/app/projects/"
                className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                  pathname.startsWith("/app/projects") ? "active" : ""
                }`}
              >
                <BriefcaseIcon className="w-5 h-5  transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />

                <span className="ml-3">Projects</span>
              </Link>
            </li>
            <li>
              <Link
                href="/app/contents/"
                className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                  pathname.startsWith("/app/contents") ? "active" : ""
                }`}
              >
                <RectangleGroupIcon className="w-5 h-5  transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />

                <span className="ml-3">All contents</span>
              </Link>
            </li>

            <li>
              <Link
                href="/app/notifications/"
                className={`flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                  pathname.startsWith("/app/notifications") ? "active" : ""
                }`}
              >
                <BellIcon className="w-5 h-5  transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />

                <span className="ml-3">Notifications</span>
              </Link>
            </li>
          </ul>
          <ul className="pt-4 mt-4 space-y-2 font-medium border-t border-gray-200 dark:border-gray-700">
            <li className="text-center">
              <Link
                href="/app/organizations/"
                className={`flex items-center justify-between p-2 border border-black border-dashed text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group ${
                  pathname.startsWith("/app/organizations") ? "active" : ""
                }`}
              >
                <div className="flex">
                  <QueueListIcon className="w-5 h-5  transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />

                  <span className="ml-3">Organizations</span>
                </div>
                <ChevronUpDownIcon className="w-5 h-5  transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
              </Link>
            </li>
            <li>
              <a
                onClick={signOutHandler}
                className="flex items-center cursor-pointer p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              >
                <ArrowLeftOnRectangleIcon className="w-5 h-5  transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />

                <span className="ml-3">Sign out</span>
              </a>
            </li>
          </ul>
          <div
            id="dropdown-cta"
            className="p-4 mt-6 rounded-lg bg-blue-50 dark:bg-blue-900"
            role="alert"
          >
            <div className="flex items-center mb-3">
              <span className="bg-green-100 text-green-800 text-sm font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-orange-200 dark:text-orange-900">
                Free plan
              </span>
              <button
                type="button"
                className="ml-auto -mx-1.5 -my-1.5 bg-blue-50 inline-flex justify-center items-center w-6 h-6 text-blue-900 rounded-lg focus:ring-2 focus:ring-blue-400 p-1 hover:bg-blue-200 h-6 w-6 dark:bg-blue-900 dark:text-blue-400 dark:hover:bg-blue-800"
                data-dismiss-target="#dropdown-cta"
                aria-label="Close"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="w-2.5 h-2.5"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
              </button>
            </div>
            <p className="mb-3 text-sm text-blue-800 dark:text-blue-400">
              You are using the application in Free mode.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
