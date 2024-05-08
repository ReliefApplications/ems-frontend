import { gql } from 'apollo-angular';

/** Graphql request for getting resource  */
export const GET_RESOURCE = gql`
  query GetResource($id: ID!) {
    resource(id: $id) {
      id
      name
      queryName
      fields
      layouts {
        edges {
          node {
            id
            name
            query
            createdAt
            display
          }
        }
        totalCount
      }
      metadata {
        name
        type
        fields {
          name
          type
        }
      }
    }
  }
`;

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

/**
 * Get metadata of form / resource query definition.
 */
export const GET_QUERY_META_DATA = gql`
  query GetQueryMetaData($id: ID!) {
    form(id: $id) {
      id
      metadata {
        name
        automated
        type
        editor
        filter
        multiSelect
        filterable
        options
        fields {
          name
          automated
          type
          editor
          filter
          multiSelect
          filterable
          options
        }
      }
    }
    resource(id: $id) {
      id
      metadata {
        name
        automated
        type
        editor
        filter
        multiSelect
        filterable
        options
        fields {
          name
          automated
          type
          editor
          filter
          multiSelect
          filterable
          options
        }
      }
    }
  }
`;

/** Graphql query for getting multiple resources with a cursor */
export const GET_RESOURCES = gql`
  query GetResources(
    $first: Int
    $afterCursor: ID
    $sortField: String
    $filter: JSON
  ) {
    resources(
      first: $first
      afterCursor: $afterCursor
      sortField: $sortField
      filter: $filter
    ) {
      edges {
        node {
          id
          name
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

/** Graphql query for getting data set by filter layout */
export const GET_DATA_SET = gql`
  query getDataSet($query: JSON!) {
    dataSet(query: $query) {
      records
      emails
      totalCount
      tabIndex
      __typename
    }
  }
`;

/** Graphql query for getting data set by filter layout */
export const GET_EMAIL_NOTIFICATIONS = gql`
  query EmailNotifications($applicationId: ID!, $limit: Int, $skip: Int) {
    emailNotifications(
      applicationId: $applicationId
      limit: $limit
      skip: $skip
    ) {
      edges {
        node {
          applicationId
          createdAt
          recipients {
            distributionListName
            To
            Bcc
            Cc
          }
          name
          id
          notificationType
          createdBy
        }
      }
    }
  }
`;

/** Graphql query for getting data set by filter layout */
export const ADD_EMAIL_NOTIFICATION = gql`
  mutation Mutation($notification: EmailNotificationInputType!) {
    addEmailNotification(notification: $notification) {
      dataSets {
        pageSize
        filter
        fields
        tableStyle
        blockType
        textStyle
        individualEmail
      }
      modifiedAt
      schedule
      createdBy
      emailLayout {
        subject
        header
        footer
        body
        banner
      }
      id
      isDeleted
      lastExecution
      name
      notificationType
      recipients {
        distributionListName
        To
        Cc
        Bcc
      }
      recipientsType
      status
    }
  }
`;

/** Graphql query for getting  EMAIL_NOTIFICATION */
export const GET_AND_UPDATE_EMAIL_NOTIFICATION = gql`
  mutation EditEmailNotification(
    $editEmailNotificationId: ID!
    $applicationId: ID!
    $notification: EmailNotificationInputType
  ) {
    editAndGetEmailNotification(
      id: $editEmailNotificationId
      application: $applicationId
      notification: $notification
    ) {
      createdAt
      createdBy
      dataSets {
        fields
        filter
        name
        pageSize
        resource {
          id
          name
        }
        tableStyle
        blockType
        textStyle
        individualEmail
      }
      id
      name
      notificationType
      recipients {
        distributionListName
        To
        Cc
        Bcc
      }
      status
      schedule
      modifiedAt
      emailLayout {
        banner
        body
        footer
        header
        subject
      }
      lastExecution
      recipientsType
      isDeleted
    }
  }
`;
