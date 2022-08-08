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
  loading: boolean;
  channels: Channel[];
}

// === GET META FIELDS OF A GRID ===

/** Graphql request for getting the meta fields of a grid by form id */
export const GET_GRID_FORM_META = gql`
  query GetFormAsTemplate($id: ID!) {
    form(id: $id) {
      id
      name
      queryName
      fields
      layouts {
        id
        name
        createdAt
        query
        display
      }
    }
  }
`;

// === GET RELATED FORMS FROM RESOURCE ===

/** Graphql request for getting resource meta date for a grid */
export const GET_GRID_RESOURCE_META = gql`
  query GetGridResourceMeta($resource: ID!) {
    resource(id: $resource) {
      id
      name
      queryName
      forms {
        id
        name
        fields
      }
      relatedForms {
        id
        name
        fields
      }
      layouts {
        id
        name
        query
        createdAt
        display
      }
    }
  }
`;

/** Model for GetFormByIdQueryResponse object */
export interface GetFormByIdQueryResponse {
  loading: boolean;
  form: Form;
}

/** Model for GetResourceByIdQueryResponse object */
export interface GetResourceByIdQueryResponse {
  loading: boolean;
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
