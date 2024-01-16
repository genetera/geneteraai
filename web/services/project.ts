import APIService from "@/services/api";
import { IProject } from "@/types/project";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

class ProjectService extends APIService {
  constructor() {
    const BASE_URL = API_BASE_URL + "projects/";

    super(BASE_URL as string);
  }

  async getProjects(forOrganizations: string[] = []): Promise<IProject[]> {
    return this.get(`?organizations=${forOrganizations}`)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async createProject(data: Partial<IProject>): Promise<IProject> {
    return this.post("", data)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }

  async deleteProject(project_id: string): Promise<any> {
    return this.delete(project_id)
      .then((response) => response?.data)
      .catch((error) => {
        throw error?.response?.data;
      });
  }
}

export default new ProjectService();
