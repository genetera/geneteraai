import APIService from "@/services/api";
import { INotifications } from "@/types/notification";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

class NotificationService extends APIService {
  constructor() {
    const BASE_URL = API_BASE_URL + "notifications/";

    super(BASE_URL as string);
  }

  async getNotifications(): Promise<INotifications[]> {
    return this.get("")
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }
}

export default new NotificationService();
