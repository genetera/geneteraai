import React, { useState, useEffect } from "react";
import { NextPage } from "next";
import { MultiSelect, MultiSelectItem } from "@tremor/react";

import { IOrganization } from "@/types/organization";
import { IProject } from "@/types/project";
import {
  IContentCategory,
  IContentPlatform,
  IContentEmotion,
} from "@/types/content";

import OrganizationService from "@/services/organizations";
import ProjectService from "@/services/project";
import ContentService from "@/services/content";

interface IProps {
  setFilterParams: any;
}

const ContentsFilter: NextPage<IProps> = (props) => {
  const [organizations, setOrganizations] = useState<IOrganization[]>(
    [] as IOrganization[]
  );
  const [organizationsToFilter, setOrganizationsToFilter] = useState<string[]>(
    [] as string[]
  );

  const [projects, setProjects] = useState<IProject[]>([] as IProject[]);
  const [projectsToFilter, setProjectsToFilter] = useState<string[]>(
    [] as string[]
  );

  const [categories, setCategories] = useState<IContentCategory[]>(
    [] as IContentCategory[]
  );
  const [categoriesToFilter, setCategoriesToFilter] = useState<string[]>(
    [] as string[]
  );

  const [platforms, setPlatforms] = useState<IContentPlatform[]>(
    [] as IContentPlatform[]
  );
  const [platformsToFilter, setPlatformsToFilter] = useState<string[]>(
    [] as string[]
  );

  const [emotions, setEmotions] = useState<IContentEmotion[]>(
    [] as IContentEmotion[]
  );
  const [emotionsToFilter, setEmotionsToFilter] = useState<string[]>(
    [] as string[]
  );

  useEffect(() => {
    (async () => {
      const [organizations, projects, categories, platforms, emotions] =
        await Promise.all([
          OrganizationService.getOrganizations(),
          ProjectService.getProjects(),
          ContentService.getContentCategories(),
          ContentService.getContentPlatforms(),
          ContentService.getContentEmotions(),
        ]);

      setOrganizations(organizations);
      setProjects(projects);
      setCategories(categories);
      setPlatforms(platforms);
      setEmotions(emotions);
    })();
  }, []);

  useEffect(() => {
    let paramsData = {};

    const filterData = [
      { organizations: organizationsToFilter },
      { projects: projectsToFilter },
      { categories: categoriesToFilter },
      { platforms: platformsToFilter },
      { emotions: emotionsToFilter },
    ];

    filterData.forEach((obj) => {
      if (Object.values(obj)[0].length != 0) {
        paramsData = Object.assign(
          { [Object.keys(obj)[0]]: Object.values(obj)[0] },
          paramsData
        );
      }
    });
    const searchParams = new URLSearchParams(paramsData);
    props.setFilterParams(searchParams.toString());
  }, [
    organizationsToFilter,
    projectsToFilter,
    categoriesToFilter,
    platformsToFilter,
    emotionsToFilter,
  ]);
  return (
    <div className="flex gap-2 mt-4 mb-2">
      <MultiSelect
        placeholder="All organizations"
        value={organizationsToFilter}
        onValueChange={setOrganizationsToFilter}
      >
        {organizations?.map((organization, indx) => (
          <MultiSelectItem value={organization.id} key={indx}>
            {organization.name}
          </MultiSelectItem>
        ))}
      </MultiSelect>
      <MultiSelect
        placeholder="All projects"
        value={projectsToFilter}
        onValueChange={setProjectsToFilter}
      >
        {projects?.map((project, indx) => (
          <MultiSelectItem value={project.id} key={indx}>
            {project.name}
          </MultiSelectItem>
        ))}
      </MultiSelect>
      <MultiSelect
        placeholder="All categories"
        value={categoriesToFilter}
        onValueChange={setCategoriesToFilter}
      >
        {categories?.map((category, indx) => (
          <MultiSelectItem value={category.id} key={indx}>
            {category.name}
          </MultiSelectItem>
        ))}
      </MultiSelect>
      <MultiSelect
        placeholder="All platforms"
        value={platformsToFilter}
        onValueChange={setPlatformsToFilter}
      >
        {platforms?.map((platform, indx) => (
          <MultiSelectItem value={platform.id} key={indx}>
            {platform.name}
          </MultiSelectItem>
        ))}
      </MultiSelect>
      <MultiSelect
        placeholder="All emotions"
        value={emotionsToFilter}
        onValueChange={setEmotionsToFilter}
      >
        {emotions?.map((emotion, indx) => (
          <MultiSelectItem value={emotion.id} key={indx}>
            {emotion.name}
          </MultiSelectItem>
        ))}
      </MultiSelect>
    </div>
  );
};

export default ContentsFilter;
