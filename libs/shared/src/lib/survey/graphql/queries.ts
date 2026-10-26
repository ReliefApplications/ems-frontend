import { gql } from 'apollo-angular';

// === GET ROLES FROM APPLICATION ===

/** Graphql request for getting roles of applications by the application ids */
export const GET_ROLES_FROM_APPLICATIONS = gql`
  query GetRolesFromApplications($applications: [ID]!) {
    rolesFromApplications(applications: $applications) {
      id
      title(appendApplicationName: true)
    }
  }
`;

// === GET RESOURCE QUESTION RECORD ===
/**
 * Graphql request for getting the data of the record selected in a resource
 * question, including its calculated fields, to expose it as survey variables.
 */
export const GET_RESOURCE_QUESTION_RECORD = gql`
  query GetResourceQuestionRecord($id: ID!) {
    record(id: $id) {
      id
      incrementalId
      data(calculatedFields: true)
    }
  }
`;

/** Get short resource graphql query definition */
export const GET_SHORT_RESOURCE_BY_ID = gql`
  query GetShortResourceById($id: ID!) {
    resource(id: $id) {
      id
      name
      queryName
      createdAt
      fields
      forms {
        id
        name
        status
        createdAt
        recordsCount
        core
        canUpdate
        canDelete
      }
    }
  }
`;
