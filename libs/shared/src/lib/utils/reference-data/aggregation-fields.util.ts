import { ReferenceData } from '../../models/reference-data.model';
import { QueryBuilderService } from '../../services/query-builder/query-builder.service';

/**
 * Get list of aggregation fields from reference data
 *
 * @param referenceData Reference data
 * @param queryBuilder query builder service instance
 * @returns list of fields
 */
export const getReferenceDataAggregationFields = (
  referenceData: ReferenceData,
  queryBuilder: QueryBuilderService
) => {
  const fields = queryBuilder
    .getFields(referenceData.graphQLTypeName as string)
    .filter(
      (field: any) =>
        !(
          field.name.includes('_id') &&
          (field.type.name === 'ID' ||
            (field.type?.kind === 'LIST' && field.type.ofType.name === 'ID'))
        )
    );
  for (const field of referenceData.fields || []) {
    if (!fields.find((f) => f.name === field.name)) {
      // todo: there should be a switch using field type
      fields.push({
        name: field.name,
        type: { kind: 'SCALAR', name: 'String', fields: [] },
        args: [],
      });
    }
  }
  return fields;
};

export default getReferenceDataAggregationFields;
