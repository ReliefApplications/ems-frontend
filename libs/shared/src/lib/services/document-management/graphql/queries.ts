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
    $withAetiology: Boolean! = false
    $withInformationConfidentiality: Boolean! = false
    $withCountry: Boolean! = false
    $withDiseaseCond: Boolean! = false
    $withDocumentCategory: Boolean! = false
    $withDocumentType: Boolean! = false
    $withHazard: Boolean! = false
    $withIHRCommunication: Boolean! = false
    $withAssignmentFunction: Boolean! = false
    $withLanguage: Boolean! = false
    $withOccurrence: Boolean! = false
    $withOccurrenceType: Boolean! = false
    $withSourceOfInformation: Boolean! = false
    $withSyndrome: Boolean! = false
    $withRegion: Boolean! = false
  ) {
    metadata: vw_allmetatablerelations(filter: $filter) {
      aggregate_count
      id: aetiologyid @include(if: $withAetiology)
      name: aetiologyname @include(if: $withAetiology)
      id: informationconfidentialityid
        @include(if: $withInformationConfidentiality)
      name: informationconfidentialityname
        @include(if: $withInformationConfidentiality)
      id: countryid @include(if: $withCountry)
      name: countryname @include(if: $withCountry)
      id: diseasecondid @include(if: $withDiseaseCond)
      name: diseasecondname @include(if: $withDiseaseCond)
      id: documentcategoryid @include(if: $withDocumentCategory)
      name: documentcategoryname @include(if: $withDocumentCategory)
      id: documenttypeid @include(if: $withDocumentType)
      name: documenttypename @include(if: $withDocumentType)
      id: hazardid @include(if: $withHazard)
      name: hazardname @include(if: $withHazard)
      id: ihrcommunicationid @include(if: $withIHRCommunication)
      name: ihrcommunicationname @include(if: $withIHRCommunication)
      id: assignmentfunctionid @include(if: $withAssignmentFunction)
      name: assignmentfunctionname @include(if: $withAssignmentFunction)
      id: languageid @include(if: $withLanguage)
      name: languagename @include(if: $withLanguage)
      id: occurrenceid @include(if: $withOccurrence)
      name: occurrencename @include(if: $withOccurrence)
      id: occurrencetype @include(if: $withOccurrenceType)
      id: sourceofinformationid @include(if: $withSourceOfInformation)
      name: sourceofinformationname @include(if: $withSourceOfInformation)
      id: syndromeid @include(if: $withSyndrome)
      name: syndromename @include(if: $withSyndrome)
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

/** Get Occurrence Types query definition */
export const GET_OCCURRENCE_TYPES = gql`
  query GetOccurrenceTypes {
    occurrencetypes {
      id
      name
    }
  }
`;

/** Get Occurrence Types Response Interface */
export interface GetOccurrenceTypesResponse {
  occurrencetypes: {
    id: string;
    name: string;
  }[];
}
