import { gql } from 'apollo-angular';
import { FileExplorerDocument } from '../../../components/file-explorer/types/file-explorer-document.type';

/** Get Drive ID query definition */
export const GET_DRIVE_ID = gql`
  query {
    storagedrive(drivetype: 2) {
      driveid
    }
  }
`;

/** Interface of drive query response */
export interface DriveQueryResponse {
  storagedrive: {
    driveid: string;
  };
}

/** Get Occurrence by id query definition */
export const GET_OCCURRENCE_BY_ID = gql`
  query DocumentManagement_GetOccurrenceById($id: String!) {
    occurrence(id: $id) {
      id
      occurrencename
      occurrencetype
      driveid
    }
  }
`;

/** Occurrence Query Response */
export interface OccurrenceQueryResponse {
  occurrence: {
    id: string;
    occurrencename: string;
    occurrencetype: number;
    driveid: string;
  };
}

/** GQL query to list documents */
export const GET_DOCUMENTS = gql`
  query GetDocuments($offset: Int, $filter: JSON) {
    items: vw_allmetatablerelations(
      limitItems: 10
      offset: $offset
      filter: $filter
    ) {
      document {
        id
        filename
        createddate
        modifiedbyuser {
          firstname
          lastname
        }
        modifieddate
        occurrence {
          driveid
        }
        documenttypemetadatas {
          documenttype {
            id
            name
          }
        }
      }
    }
    metadata: vw_allmetatablerelations(filter: $filter) {
      aggregate_count
      aggregate_id_max
    }
  }
`;

/** List documents query interface */
export interface GetDocumentsQueryResponse {
  items: {
    document: FileExplorerDocument;
  }[];
  metadata: {
    aggregate_count: number;
    aggregate_id_max: string;
  }[];
}
