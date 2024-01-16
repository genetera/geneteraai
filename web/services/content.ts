import APIService from "@/services/api";
import {
  IContent,
  ICreateContent,
  IContentCategory,
  IContentPlatform,
  IContentEmotion,
  IContentData,
} from "@/types/content";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

class ContentService extends APIService {
  constructor() {
    const BASE_URL = API_BASE_URL + "contents/";

    super(BASE_URL as string);
  }

  async getContents(params: string = ""): Promise<IContent[]> {
    return this.get(`?${params}`)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async getContent(contentId: string): Promise<IContent> {
    return this.get(contentId)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async createContent(data: ICreateContent): Promise<IContent> {
    return this.post("", data)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async deleteContent(content_id: string): Promise<any> {
    return this.delete(content_id)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async getContentCategories(): Promise<IContentCategory[]> {
    return this.get("categories/")
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async getContentPlatforms(): Promise<IContentPlatform[]> {
    return this.get("platforms/")
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async getContentEmotions(): Promise<IContentEmotion[]> {
    return this.get("emotions/")
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async downloadContent(
    contentId: string,
    data: { content: string | undefined }
  ): Promise<any> {
    return this.post(`${contentId}/download/`, data, { responseType: "blob" })
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async saveContentResponse(
    contentId: string,
    data: { content: string | undefined }
  ): Promise<any> {
    return this.put(`${contentId}/save/`, data)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async editContent(contentId: string, data: IContentData): Promise<any> {
    return this.post(`${contentId}/edit/`, data)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async summarizeContent(
    contentId: string,
    data: { content: string | undefined }
  ): Promise<any> {
    return this.post(`${contentId}/summarize/`, data)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async rephraseContent(
    contentId: string,
    data: { content: string | undefined }
  ): Promise<any> {
    return this.post(`${contentId}/rephrase/`, data)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }
}

export default new ContentService();
