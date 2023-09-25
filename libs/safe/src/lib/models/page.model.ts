import { Application } from './application.model';

/**
 * Enum of content types.
 */
export enum ContentType {
  workflow = 'workflow',
  dashboard = 'dashboard',
  form = 'form',
}

/**
 * Content type interface.
 */
export interface IContentType {
  value: string;
  name: string;
  img: string;
  color: string;
  focusColor: string;
}

/** Interface for the page context */
export type PageContextT = (
  | {
      refData: string;
    }
  | {
      resource: string;
    }
) & {
  displayField: string;
};

/**
 * Available content types.
 */
export const CONTENT_TYPES: IContentType[] = [
  {
    value: 'form',
    name: 'form',
    img: '/assets/form.svg',
    color: '#C5D3FC33',
    focusColor: '#92ADFF',
  },
  {
    value: 'workflow',
    name: 'workflow',
    img: '/assets/workflow.svg',
    color: '#C6E6EA33',
    focusColor: '#8CCDD5',
  },
  {
    value: 'dashboard',
    name: 'dashboard',
    img: '/assets/dashboard.svg',
    color: '#F6C48133',
    focusColor: '#F6C481',
  },
];

/**
 * Model for Page object.
 */
export interface Page {
  id?: string;
  name?: string;
  createdAt?: Date;
  modifiedAt?: Date;
  type?: ContentType;
  content?: string;
  settings?: any;
  permissions?: any;
  application?: Application;
  canSee?: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
  context?: PageContextT;
  contentWithContext?: ((
    | {
        // The element string is the value for the value field of the refData
        element: string;
      }
    | {
        record: string;
      }
  ) & {
    content: string;
  })[];
}

/** Model for page graphql query response */
export interface PageQueryResponse {
  page: Page;
}

/** Model for add page graphql mutation response */
export interface AddPageMutationResponse {
  addPage: Page;
}

/** Model for duplicate page graphql mutation response */
export interface DuplicatePageMutationResponse {
  duplicatePage: Page;
}

/** Model for edit page graphql mutation response */
export interface EditPageMutationResponse {
  editPage: Page;
}

/** Model for delete page graphql mutation response */
export interface DeletePageMutationResponse {
  deletePage: Page;
}

/** Model for edit page context mutation response object */
export interface EditPageContextMutationResponse {
  editPageContext: Pick<Page, 'context' | 'id' | 'contentWithContext'>;
}
