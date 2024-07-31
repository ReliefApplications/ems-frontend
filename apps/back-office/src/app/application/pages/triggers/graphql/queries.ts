import { gql } from 'apollo-angular';

/** Graphql query for getting resources with a filter and more data */
export const GET_RESOURCES = gql`
  query GetResources(
    $first: Int
    $afterCursor: ID
    $filter: JSON
    $sortField: String
    $sortOrder: String
    $application: ID!
  ) {
    resources(
      first: $first
      afterCursor: $afterCursor
      filter: $filter
      sortField: $sortField
      sortOrder: $sortOrder
    ) {
      edges {
        node {
          id
          name
          customNotifications(application: $application) {
            name
            description
            schedule
            notificationType
            resource
            layout
            template
            recipients
            recipientsType
            status
            onRecordCreation
            onRecordUpdate
            applicationTrigger
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

/** GraphQL query to get a single resource */
export const GET_RESOURCE = gql`
  query GetResources($id: ID!) {
    resource(id: $id) {
      id
      forms {
        id
        name
        fields
      }
    }
  }
`;
