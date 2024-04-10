import { gql } from 'apollo-angular';

// === ADD FORM ===
/** Add form gql mutation definition */
export const ADD_FORM = gql`
  mutation addForm($name: String!, $resource: ID, $template: ID) {
    addForm(name: $name, resource: $resource, template: $template) {
      id
      name
      createdAt
      status
      versions {
        id
      }
    }
  }
`;

// == DELETE RESOURCE ==
/** Delete resource gql mutation definition */
export const DELETE_RESOURCE = gql`
  mutation deleteResource($id: ID!) {
    deleteResource(id: $id) {
      id
    }
  }
`;

// == DUPLICATE RESOURCE ==
/** Duplicate resource gql mutation definition */
export const DUPLICATE_RESOURCE = gql`
  mutation duplicateResource($id: ID!) {
    duplicateResource(id: $id) {
      id
      name
      createdAt
      recordsCount
      canDelete
    }
  }
`;

/** Edit resource gql mutation definition */
export const EDIT_RESOURCE_ID_SHAPE = gql`
  mutation editResource($id: ID!, $idShape: IdShapeType) {
    editResource(id: $id, idShape: $idShape) {
      id
      idShape {
        shape
        padding
      }
    }
  }
`;

/** Edit resource gql mutation definition */
export const EDIT_RESOURCE_IMPORT_FIELD = gql`
  mutation editResource($id: ID!, $importField: String) {
    editResource(id: $id, importField: $importField) {
      id
      importField
    }
  }
`;
