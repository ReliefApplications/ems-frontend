/**
 * Interface for Aggregation objects.
 */
export interface Aggregation {
  id?: string;
  name?: string;
  sourceFields?: any;
  pipeline?: any;
}

/** Model for add aggregation mutation response */
export interface AddAggregationMutationResponse {
  addAggregation: Aggregation;
}

/** Model for edit aggregation mutation response */
export interface EditAggregationMutationResponse {
  editAggregation: Aggregation;
}

/** Model for delete aggregation mutation response */
export interface DeleteAggregationMutationResponse {
  deleteAggregation: Aggregation;
}

/** Model for aggregation data query response */
export interface AggregationDataQueryResponse {
  recordsAggregation: any | { items: any[]; totalCount: number };
}

/** Aggregation on reference data query response interface */
export interface ReferenceDataAggregationQueryResponse {
  referenceDataAggregation: any | { items: any[]; totalCount: number };
}
