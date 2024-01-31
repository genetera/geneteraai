"use client";

import React from "react";
import Text from "@/components/ui/text";
import ButtonSecondary from "@/components/ui/buttons/button-secondary";
import { BookmarkIcon } from "@heroicons/react/24/outline";
import { Divider } from "@tremor/react";
import ContentLoader from "@/components/ui/content-loader";
import NoContent from "@/components/ui/no-content";

import NotificationService from "@/services/notifications";

import useSWR from "swr";
import { INotifications } from "@/types/notification";
import { NOTIFICATIONS_LIST } from "@/constants/fetch-keys";

const Notifications = () => {
  const {
    data: notifications,
    isLoading: isNotificationLoading,
    error: notificationsError,
  } = useSWR<INotifications[]>(NOTIFICATIONS_LIST, () =>
    NotificationService.getNotifications()
  );

  return (
    <>
      <div className="px-10 py-2 ">
        <div className="flex flex-row justify-between items-center">
          <Text className="text-4xl font-extrabold text-black-500">
            Notifications
          </Text>
          <div className="space-x-2">
            <ButtonSecondary icon={BookmarkIcon}>
              Mark all as read
            </ButtonSecondary>
          </div>
        </div>
        {isNotificationLoading && <ContentLoader />}
        {!isNotificationLoading && notifications?.length === 0 && <NoContent />}
        {!isNotificationLoading && (
          <div className="mt-8">
            {notifications?.map((notification, indx) => (
              <div className="lg:px-6 " key={indx}>
                <h5 className="font-bold text-lg">{notification.title}</h5>
                <p className="mt-2">{notification.message}</p>
                <p className="mt-2 text-gray-600">{notification.created_at}</p>
                <Divider />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Notifications;
