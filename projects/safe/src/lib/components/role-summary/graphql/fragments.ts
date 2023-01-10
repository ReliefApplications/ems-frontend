import { gql } from 'apollo-angular';

/** GraphQL short resource fields for role summary */
export const SHORT_RESOURCE_FIELDS = gql`
  fragment ShortResourceFields on Resource {
    id
    name
    rolePermissions(role: $role)
  }
`;

/** GraphQL resource fields for role summary */
export const RESOURCE_FIELDS = gql`
  fragment ResourceFields on Resource {
    id
    name
    rolePermissions(role: $role)
    metadata {
      name
      filterable
    }
    fields
  }
`;
