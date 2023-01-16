import { gql } from 'apollo-angular';
import { Channel } from '../../../../models/channel.model';
import { Form } from '../../../../models/form.model';
import { Resource } from '../../../../models/resource.model';

// === GET CHANNELS ===

/** Graphql request for getting channels (optionnally by an application id) */
export const GET_CHANNELS = gql`
  query getChannels($application: ID) {
    channels(application: $application) {
      id
      title
      application {
        id
        name
      }
    }
  }
`;

/** Model for GetChannelsQueryResponse object */
export interface GetChannelsQueryResponse {
  channels: Channel[];
}

// === GET META FIELDS OF A GRID ===

/** Graphql request for getting the meta fields of a grid by form id */
export const GET_GRID_FORM_META = gql`
  query GetFormAsTemplate($id: ID!, $layoutIds: [ID], $first: Int) {
    form(id: $id) {
      id
      name
      queryName
      layouts(ids: $layoutIds, first: $first) {
        edges {
          node {
            id
            name
            createdAt
            query
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

// === GET RELATED FORMS FROM RESOURCE ===

/** Graphql request for getting resource meta date for a grid */
export const GET_GRID_RESOURCE_META = gql`
  query GetGridResourceMeta(
    $resource: ID!
    $layoutIds: [ID]
    $firstLayouts: Int
    $aggregationIds: [ID]
    $firstAggregations: Int
  ) {
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
        resource {
          id
          queryName
          name
          fields
        }
      }
      layouts(ids: $layoutIds, first: $firstLayouts) {
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
      aggregations(ids: $aggregationIds, first: $firstAggregations) {
        edges {
          node {
            id
            name
            sourceFields
            pipeline
            createdAt
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

/** Model for GetFormByIdQueryResponse object */
export interface GetFormByIdQueryResponse {
  form: Form;
}

/** Model for GetResourceByIdQueryResponse object */
export interface GetResourceByIdQueryResponse {
  resource: Resource;
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

// === GET RESOURCES ===
/** Graphql query for getting multiple resources with a cursor */
export const GET_RESOURCES = gql`
  query GetResources($first: Int, $afterCursor: ID, $sortField: String) {
    resources(first: $first, afterCursor: $afterCursor, sortField: $sortField) {
      edges {
        node {
          id
          name
          forms {
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

/** Model for GetResourcesQueryResponse object */
export interface GetResourcesQueryResponse {
  resources: {
    edges: {
      node: Resource;
      cursor: string;
    }[];
    pageInfo: {
      endCursor: string;
      hasNextPage: boolean;
    };
    totalCount: number;
  };
}
