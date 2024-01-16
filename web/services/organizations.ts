import APIService from "@/services/api";
import { IOrganization, IDocument } from "@/types/organization";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

class OrganizationService extends APIService {
  constructor() {
    const BASE_URL = API_BASE_URL + "organizations/";

    super(BASE_URL as string);
  }

  async getOrganizations(): Promise<IOrganization[]> {
    return this.get("")
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async getOrganization(organizationId: string): Promise<IOrganization> {
    return this.get(organizationId)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async createOrganization(
    data: Partial<IOrganization>
  ): Promise<IOrganization> {
    return this.post("", data)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async deleteOrganization(organization_id: string): Promise<any> {
    return this.delete(organization_id)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async getOrganizationDocuments(organizationId: string): Promise<IDocument[]> {
    return this.get(`${organizationId}/documents`)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async deleteOrganizationDocument(
    organizationId: string,
    documentId: string
  ): Promise<IDocument[]> {
    return this.delete(`${organizationId}/documents/${documentId}`)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async uploadOrganizationDocument(
    organizationId: string,
    file: any
  ): Promise<IDocument> {
    return this.mediaUpload(`${organizationId}/documents/upload`, file)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }
}

export default new OrganizationService();
