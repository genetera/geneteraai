import { IOrganization } from "./organization";
import { IProject } from "./project";

export interface IContentCategory {
  id: string;
  name: string;
  icon: string;
}

export interface IContentPlatform {
  id: string;
  name: string;
  url: string;
  icon: string;
}

export interface IContentEmotion {
  id: string;
  name: string;
  icon: string;
}

type Priority = "Urgent" | "High" | "Medium" | "Low" | "None";

type Status = "Published" | "Done" | "In progress" | "Todo";

export interface IContent {
  id: string;
  title: string;
  content: string;
  organization: IOrganization;
  project: IProject;
  platform: IContentPlatform;
  category: IContentCategory;
  emotion: IContentEmotion;
  status: Status;
  priority: Priority;
  created_at: string;
  updated_at: string;
}

export interface ICreateContent {
  title: string;
  description: string;
  organization: string;
  project: string;
  platform: string;
  category: string;
  emotion: string;
}

export interface IContentData {
  prompt: string;
  content: string | undefined;
}
