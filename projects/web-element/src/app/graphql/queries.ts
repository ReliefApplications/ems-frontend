import gql from 'graphql-tag';
import { Dashboard, Form } from '@safe/builder';

// === GET DASHBOARD BY ID ===
export const GET_DASHBOARD_BY_ID = gql`
  query GetDashboardById($id: ID!){
    dashboard(id: $id){
      id
      name
      structure
    }
  }
`;

export interface GetDashboardByIdQueryResponse {
  loading: boolean;
  dashboard: Dashboard;
}

// === GET FORM BY ID ===
export const GET_SHORT_FORM_BY_ID = gql`
query GetShortFormById($id: ID!) {
  form(id: $id) {
    id
    name
    structure
    fields
    status
    canCreateRecords
    uniqueRecord {
      id
      modifiedAt
      data
    }
    canUpdate
  }
}`;

export interface GetFormByIdQueryResponse {
  loading: boolean;
  form: Form;
}
