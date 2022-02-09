import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { prettifyLabel } from '../../utils/prettify';

const formBuilder = new FormBuilder();

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
      return formBuilder.group({
        logic: filter.logic || 'and',
        filters: formBuilder.array(filters),
      });
    } else {
      if (filter.field) {
        return formBuilder.group({
          field: filter.field,
          operator: filter.operator || 'eq',
          value: Array.isArray(filter.value) ? [filter.value] : filter.value,
        });
      }
    }
  }
  return formBuilder.group({
    logic: 'and',
    filters: formBuilder.array([]),
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
      return formBuilder.group({
        name: [{ value: field.name, disabled: true }],
        label: [field.label],
        type: [newField ? field.type.ofType.name : field.type],
        kind: [newField ? field.type.kind : field.kind],
        fields: formBuilder.array(
          !newField && field.fields
            ? field.fields.map((x: any) => addNewField(x))
            : [],
          Validators.required
        ),
        sort: formBuilder.group({
          field: [field.sort ? field.sort.field : ''],
          order: [field.sort && field.sort.order ? field.sort.order : 'asc'],
        }),
        filter: newField
          ? formBuilder.group({})
          : createFilterGroup(field.filter, null),
      });
    }
    case 'OBJECT': {
      return formBuilder.group({
        name: [{ value: field.name, disabled: true }],
        type: [newField ? field.type.name : field.type],
        kind: [newField ? field.type.kind : field.kind],
        fields: formBuilder.array(
          !newField && field.fields
            ? field.fields.map((x: any) => addNewField(x))
            : [],
          Validators.required
        ),
      });
    }
    default: {
      return formBuilder.group({
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
  formBuilder.group({
    name: [value ? value.name : '', validators ? Validators.required : null],
    template: [value ? value.template : '', null],
    fields: formBuilder.array(
      value && value.fields ? value.fields.map((x: any) => addNewField(x)) : [],
      validators ? Validators.required : null
    ),
    sort: formBuilder.group({
      field: [value && value.sort ? value.sort.field : ''],
      order: [value && value.sort ? value.sort.order : 'asc'],
    }),
    filter: createFilterGroup(value && value.filter ? value.filter : {}, null),
  });
