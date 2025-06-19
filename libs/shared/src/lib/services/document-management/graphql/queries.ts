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
  query {
    vw_allmetatablerelations(limitItems: 10, offset: 0) {
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
  }
`;

/** List documents query interface */
export interface GetDocumentsQueryResponse {
  vw_allmetatablerelations: {
    document: FileExplorerDocument;
  }[];
}
