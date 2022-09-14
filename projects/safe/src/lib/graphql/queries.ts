import { gql } from 'apollo-angular';
import { Form } from '../models/form.model';
import { Resource } from '../models/resource.model';
import { User } from '../models/user.model';
import { Notification } from '../models/notification.model';
import { Application } from '../models/application.model';
import { Workflow } from '../models/workflow.model';
import { Dashboard } from '../models/dashboard.model';
import { ReferenceData } from '../models/reference-data.model';

// === GET PROFILE ===
/** Graphql request for getting profile of the current user */
export const GET_PROFILE = gql`
  {
    me {
      id
      firstName
      lastName
      username
      isAdmin
      name
      roles {
        id
        title
        application {
          id
        }
        permissions {
          id
        }
      }
      permissions {
        id
        type
        global
      }
      applications {
        id
        positionAttributes {
          value
        }
        name
        role {
          title
        }
      }
      oid
      favoriteApp
    }
  }
`;

/** Model for GetProfileQueryResponse object */
export interface GetProfileQueryResponse {
  loading: boolean;
  me: User;
}

// === GET FORM BY ID ===
/** Graphql request for getting the meta fields of a grid by form id */
export const GET_GRID_FORM_META = gql`
  query GetFormAsTemplate($id: ID!, $first: Int, $afterCursor: ID) {
    form(id: $id) {
      id
      name
      queryName
      layouts(first: $first, afterCursor: $afterCursor) {
        edges {
          node {
            id
            name
            query
            createdAt
            display
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
        totalCount
      }
    }
  }
`;

/**
 * Get metadata of form / resource query definition.
 */
export const GET_QUERY_META_DATA = gql`
  query GetQueryMetaData($id: ID!) {
    form(id: $id) {
      id
      metadata
    }
    resource(id: $id) {
      id
      metadata
    }
  }
`;

/** Interface of metadata query response */
export interface GetQueryMetaDataQueryResponse {
  form: Form;
  resource: Resource;
}

/** Model for GetFormByIdQueryResponse object */
export interface GetFormByIdQueryResponse {
  loading: boolean;
  form: Form;
}

// === GET RELATED FORMS FROM RESOURCE ===
/** Graphql request for getting resource meta date for a grid */
export const GET_GRID_RESOURCE_META = gql`
  query GetGridResourceMeta($resource: ID!, $first: Int, $afterCursor: ID) {
    resource(id: $resource) {
      id
      name
      queryName
      forms {
        id
        name
      }
      relatedForms {
        id
        name
        fields
      }
      layouts(first: $first, afterCursor: $afterCursor) {
        edges {
          node {
            id
            name
            query
            createdAt
            display
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
        totalCount
      }
    }
  }
`;

// === GET RESOURCE BY ID ===
/** Model for GetResourceByIdQueryResponse object */
export interface GetResourceByIdQueryResponse {
  loading: boolean;
  resource: Resource;
}

// === GET NOTIFICATIONS ===
/** Graphql request for getting notifications */
export const GET_NOTIFICATIONS = gql`
  query GetNotifications($first: Int, $afterCursor: ID) {
    notifications(first: $first, afterCursor: $afterCursor) {
      edges {
        node {
          id
          action
          content
          createdAt
          channel {
            id
            title
            application {
              id
            }
          }
          seenBy {
            id
            name
          }
        }
        cursor
      }
      totalCount
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

/** Model for GetNotificationsQueryResponse object */
export interface GetNotificationsQueryResponse {
  loading: boolean;
  notifications: {
    edges: {
      node: Notification;
      cursor: string;
    }[];
    pageInfo: {
      endCursor: string;
      hasNextPage: boolean;
    };
    totalCount: number;
  };
}

// === GET APPLICATION BY ID ===
/** Graphql request for getting application data by its id */
export const GET_APPLICATION_BY_ID = gql`
  query GetApplicationById($id: ID!, $asRole: ID) {
    application(id: $id, asRole: $asRole) {
      id
      name
      description
      createdAt
      status
      pages {
        id
        name
        type
        content
        createdAt
        canSee
        canUpdate
        canDelete
      }
      roles {
        id
        title
        permissions {
          id
          type
        }
        usersCount
        channels {
          id
          title
          application {
            id
            name
          }
        }
        application {
          id
          name
        }
      }
      users {
        id
        username
        name
        roles {
          id
          title
        }
        positionAttributes {
          value
          category {
            id
            title
          }
        }
        oid
      }
      permissions {
        canSee {
          id
          title
        }
        canUpdate {
          id
          title
        }
        canDelete {
          id
          title
        }
      }
      channels {
        id
        title
        subscribedRoles {
          id
          title
          application {
            id
            name
          }
          usersCount
        }
      }
      subscriptions {
        routingKey
        title
        channel {
          id
          title
        }
        convertTo {
          id
          name
        }
      }
      canSee
      canUpdate
      canDelete
      positionAttributeCategories {
        id
        title
      }
      locked
      lockedByUser
    }
  }
`;

/** Model for GetApplicationByIdQueryResponse object */
export interface GetApplicationByIdQueryResponse {
  loading: boolean;
  application: Application;
}

// === GET QUERY TYPES ===

/** Graphql request for getting query types */
export const GET_QUERY_TYPES = gql`
  query GetQueryTypes {
    __schema {
      types {
        name
        kind
        fields {
          name
          args {
            name
            type {
              name
              kind
              inputFields {
                name
                type {
                  name
                  kind
                }
              }
            }
          }
          type {
            name
            kind
            fields {
              name
              args {
                name
                type {
                  name
                  kind
                  inputFields {
                    name
                    type {
                      name
                      kind
                    }
                  }
                }
              }
              type {
                name
                kind
                ofType {
                  name
                  fields {
                    name
                    type {
                      name
                      kind
                      ofType {
                        name
                      }
                    }
                  }
                }
              }
            }
            ofType {
              name
              fields {
                name
                type {
                  name
                  kind
                  ofType {
                    name
                  }
                }
              }
            }
          }
        }
      }
      queryType {
        name
        kind
        fields {
          name
          args {
            name
            type {
              name
              kind
              inputFields {
                name
                type {
                  name
                  kind
                }
              }
            }
          }
          type {
            name
            kind
            ofType {
              name
              fields {
                name
                type {
                  name
                  kind
                  ofType {
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

// TODO: check type of __schema
/** Model for GetQueryTypes object */
export interface GetQueryTypes {
  loading: boolean;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  __schema: any;
}

// === GET TYPE ===

/** Graphql request for getting type info by its name */
export const GET_TYPE = gql`
  query GetType($name: String!) {
    __type(name: $name) {
      fields {
        name
        type {
          name
          kind
          ofType {
            name
            fields {
              name
              type {
                kind
              }
            }
          }
        }
      }
    }
  }
`;

// === GET WORKFLOW BY ID ===

/** Graphql request for getting workflow by its id */
export const GET_WORKFLOW_BY_ID = gql`
  query GetWorkflowById($id: ID!, $asRole: ID) {
    workflow(id: $id, asRole: $asRole) {
      id
      name
      createdAt
      modifiedAt
      canUpdate
      permissions {
        canSee {
          id
          title
        }
        canUpdate {
          id
          title
        }
        canDelete {
          id
          title
        }
      }
      steps {
        id
        name
        type
        content
        createdAt
        canDelete
      }
      page {
        id
        name
        canUpdate
        permissions {
          canSee {
            id
            title
          }
          canUpdate {
            id
            title
          }
          canDelete {
            id
            title
          }
        }
        application {
          id
        }
      }
    }
  }
`;

/** Model for GetWorkflowByIdQueryResponse object */
export interface GetWorkflowByIdQueryResponse {
  loading: boolean;
  workflow: Workflow;
}

// === GET DASHBOARD BY ID ===

/** Model for GetDashboardByIdQueryResponse object */
export interface GetDashboardByIdQueryResponse {
  loading: boolean;
  dashboard: Dashboard;
}

// === GET REFERENCE DATAS ===
/** Get reference data by id query */
export const GET_REFERENCE_DATA_BY_ID = gql`
  query GetShortReferenceDataById($id: ID!) {
    referenceData(id: $id) {
      id
      name
      modifiedAt
      type
      apiConfiguration {
        name
        graphQLEndpoint
      }
      query
      fields
      valueField
      path
      data
      graphQLFilter
    }
  }
`;

/** Get reference data query response interface */
export interface GetReferenceDataByIdQueryResponse {
  loading: boolean;
  referenceData: ReferenceData;
}
