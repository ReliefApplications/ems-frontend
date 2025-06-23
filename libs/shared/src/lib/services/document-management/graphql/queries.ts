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
  query GetDocuments(
    $offset: Int
    $filter: JSON
    $sortField: String = "modifiedat"
    $sortDirection: String = "desc"
    $regionid: Int
  ) {
    items: vw_allmetatablerelations(
      limitItems: 10
      offset: $offset
      filter: $filter
      sortBy: { field: $sortField, direction: $sortDirection }
      regionid: $regionid
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
    metadata: vw_allmetatablerelations(filter: $filter, regionid: $regionid) {
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

/**
 * Get document count per selection of tags
 */
export const COUNT_DOCUMENTS = gql`
  query CountDocuments(
    $filter: JSON
    $withCountry: Boolean!
    $withRegion: Boolean!
  ) {
    metadata: vw_allmetatablerelations(filter: $filter) {
      aggregate_count
      id: countryid @include(if: $withCountry)
      name: countryname @include(if: $withCountry)
      id: regionid @include(if: $withRegion)
      name: regionname @include(if: $withRegion)
    }
  }
`;

/** Count documents query interface */
export interface CountDocumentsQueryResponse {
  metadata: {
    aggregate_count: number;
    name: string;
    id: number;
  }[];
}
