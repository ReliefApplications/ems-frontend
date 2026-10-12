import { gql } from 'apollo-angular';

/** Graphql mutation for adding a uniqueness rule to a resource */
export const ADD_UNIQUENESS_RULE = gql`
  mutation addUniquenessRule($resource: ID!, $rule: UniquenessRuleInputType!) {
    addUniquenessRule(resource: $resource, rule: $rule) {
      id
    }
  }
`;

/** Graphql mutation for editing a uniqueness rule of a resource */
export const EDIT_UNIQUENESS_RULE = gql`
  mutation editUniquenessRule(
    $resource: ID!
    $id: ID!
    $rule: UniquenessRuleInputType!
  ) {
    editUniquenessRule(resource: $resource, id: $id, rule: $rule) {
      id
    }
  }
`;

/** Graphql mutation for deleting a uniqueness rule of a resource */
export const DELETE_UNIQUENESS_RULE = gql`
  mutation deleteUniquenessRule($resource: ID!, $id: ID!) {
    deleteUniquenessRule(resource: $resource, id: $id) {
      id
    }
  }
`;
