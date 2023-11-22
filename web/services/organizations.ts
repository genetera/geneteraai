import APIService from "@/services/api";
import { IOrganization } from "@/types/organization";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

class OrganizationService extends APIService {
  constructor() {
    const BASE_URL = API_BASE_URL + "organizations/";

    super(BASE_URL as string);
  }

  async getOrganizations(): Promise<any> {
    return this.get("")
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

  async deleteOrganization(organization_slug: string): Promise<any> {
    return this.delete(organization_slug)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }
}

export default new OrganizationService();
