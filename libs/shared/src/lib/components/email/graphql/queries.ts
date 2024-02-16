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
    $notification: EmailNotificationInputType
  ) {
    editAndGetEmailNotification(
      id: $editEmailNotificationId
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
