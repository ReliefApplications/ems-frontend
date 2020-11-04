import gql from 'graphql-tag';
import { User } from 'who-shared';

// === EDIT USER ===
export const EDIT_USER = gql`
mutation editUser($id: ID!, $roles: [ID]!) {
  editUser(id: $id, roles: $roles) {
    id
  }
}`;

export interface EditUserMutationResponse {
  loading: boolean;
  editUser: User;
}
