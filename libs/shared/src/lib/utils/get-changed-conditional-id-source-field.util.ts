/** Field definition for a conditionalId-typed field (mirrors the backend shape). */
export interface ConditionalIdField {
  name: string;
  type: string;
  sourceField: string;
}

/**
 * Looks for a conditionalId field (e.g. cecis_number) whose sourceField
 * (e.g. cecis_case) is present in the new data and differs from its current
 * value on the record. That field is immutable on an existing record, so
 * changing it must go through the clone-on-change flow instead of a normal edit.
 *
 * @param fields form or resource field definitions.
 * @param oldData current record data.
 * @param newData incoming survey/edit data.
 * @returns the first conditionalId field whose sourceField changed, or undefined.
 */
export function getChangedConditionalIdSourceField(
  fields: any[],
  oldData: any,
  newData: any
): ConditionalIdField | undefined {
  const conditionalIdFields: ConditionalIdField[] = (fields || []).filter(
    (field) => field.type === 'conditionalid'
  );
  return conditionalIdFields.find(
    (field) =>
      Object.prototype.hasOwnProperty.call(newData, field.sourceField) &&
      Boolean(newData[field.sourceField]) !==
        Boolean((oldData || {})[field.sourceField])
  );
}
