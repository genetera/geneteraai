//Fetch keys

export const ORGANIZATIONS_LIST = `ORGANIZATION_LIST`;
export const ORGANIZATION_DETAILS = (organizationId: string) =>
  `ORGANIZATION_DETAILS_${organizationId}`;
export const ORGANIZATION_DOCUMENTS_LIST = `ORGANIZATION_DOCUMENTS_LIST`;

export const PROJECTS_LIST = `PROJECTS_LIST`;

export const NOTIFICATIONS_LIST = `NOTIFICATIONS_LIST`;

export const CONTENTS_LIST = `CONTENTS_LIST`;
export const CONTENT_DETAILS = (contentId: string) =>
  `CONTENT_DETAILS_${contentId}`;
