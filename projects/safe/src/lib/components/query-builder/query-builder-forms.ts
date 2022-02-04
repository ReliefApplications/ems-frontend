import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { prettifyLabel } from '../../utils/prettify';

const fb = new FormBuilder();

/**
 * Builds a filter form
 *
 * @param filter Initial filter
 * @param fields List of fields
 * @returns Filter form
 */
export const createFilterGroup = (filter: any, fields: any): FormGroup => {
  if (filter) {
    if (filter.filters) {
      const filters = filter.filters.map((x: any) =>
        createFilterGroup(x, fields)
      );
      return fb.group({
        logic: filter.logic || 'and',
        filters: fb.array(filters),
      });
    } else {
      if (filter.field) {
        return fb.group({
          field: filter.field,
          operator: filter.operator || 'eq',
          value: Array.isArray(filter.value) ? [filter.value] : filter.value,
        });
      }
    }
  }
  return fb.group({
    logic: 'and',
    filters: fb.array([]),
  });
};

/**
 * Adds a field to the query
 *
 * @param field Field definition
 * @param newField Is the field new ?
 * @returns Field form
 */
export const addNewField = (field: any, newField?: boolean): FormGroup => {
  switch (newField ? field.type.kind : field.kind) {
    case 'LIST': {
      return fb.group({
        name: [{ value: field.name, disabled: true }],
        label: [field.label],
        type: [newField ? field.type.ofType.name : field.type],
        kind: [newField ? field.type.kind : field.kind],
        fields: fb.array(
          !newField && field.fields
            ? field.fields.map((x: any) => addNewField(x))
            : [],
          Validators.required
        ),
        sort: fb.group({
          field: [field.sort ? field.sort.field : ''],
          order: [field.sort && field.sort.order ? field.sort.order : 'asc'],
        }),
        filter: newField ? fb.group({}) : createFilterGroup(field.filter, null),
      });
    }
    case 'OBJECT': {
      return fb.group({
        name: [{ value: field.name, disabled: true }],
        type: [newField ? field.type.name : field.type],
        kind: [newField ? field.type.kind : field.kind],
        fields: fb.array(
          !newField && field.fields
            ? field.fields.map((x: any) => addNewField(x))
            : [],
          Validators.required
        ),
      });
    }
    default: {
      return fb.group({
        name: [{ value: field.name, disabled: true }],
        type: [
          { value: newField ? field.type.name : field.type, disabled: true },
        ],
        kind: [newField ? field.type.kind : field.kind],
        label: [
          field.label ? field.label : prettifyLabel(field.name),
          Validators.required,
        ],
      });
    }
  }
};

/**
 * Builds a query form.
 *
 * @param value Initial value
 * @param validators Enables or not the validators of the form
 * @returns Query form
 */
export const createQueryForm = (value: any, validators = true): FormGroup =>
  fb.group({
    name: [value ? value.name : '', validators ? Validators.required : null],
    template: [value ? value.template : '', null],
    fields: fb.array(
      value && value.fields ? value.fields.map((x: any) => addNewField(x)) : [],
      validators ? Validators.required : null
    ),
    sort: fb.group({
      field: [value && value.sort ? value.sort.field : ''],
      order: [value && value.sort ? value.sort.order : 'asc'],
    }),
    filter: createFilterGroup(value && value.filter ? value.filter : {}, null),
  });
