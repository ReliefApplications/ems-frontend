import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import get from 'lodash/get';
import { prettifyLabel } from '../../utils/prettify';

/** Creating a new instance of the FormBuilder class. */
const formBuilder = new FormBuilder();

/**
 * Builds a filter form
 *
 * @param filter Initial filter
 * @returns Filter form
 */
export const createFilterGroup = (filter: any): FormGroup => {
  if (filter?.filters) {
    const filters = filter.filters.map((x: any) => createFilterGroup(x));
    return formBuilder.group({
      logic: filter.logic || 'and',
      filters: formBuilder.array(filters),
    });
  }
  if (filter?.field) {
    return formBuilder.group({
      field: filter.field,
      operator: filter.operator || 'eq',
      value: Array.isArray(filter.value) ? [filter.value] : filter.value,
    });
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
          field: [get(field, 'sort.field', '')],
          order: [get(field, 'sort.order', 'asc')],
        }),
        filter: newField
          ? formBuilder.group({})
          : createFilterGroup(field.filter),
        first: [field.first, Validators.min(0)],
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
    name: [get(value, 'name', ''), validators ? Validators.required : null],
    template: [get(value, 'template', ''), null],
    pageSize: [value?.pageSize || 10],
    fields: formBuilder.array(
      value && value.fields ? value.fields.map((x: any) => addNewField(x)) : [],
      validators ? Validators.required : null
    ),
    sort: formBuilder.group({
      field: [get(value, 'sort.field', '')],
      order: [get(value, 'sort.order', 'asc')],
    }),
    filter: createFilterGroup(get(value, 'filter', {})),
    style: formBuilder.array(
      value && value.style && value.style.length
        ? value.style.map((x: any) => createStyleForm(x))
        : [createStyleForm(null)]
    ),
  });

/**
 * Creates a display form.
 *
 * @param value Initial value.
 * @returns Display form.
 */
export const createDisplayForm = (value: any): FormGroup =>
  formBuilder.group({
    showFilter: [value?.showFilter],
    sort: [value?.sort || []],
    fields: [value?.fields || null],
    filter: [value?.filter || null],
  });

/**
 * Creates a style form.
 *
 * @param value Initial value.
 * @returns Style form.
 */
export const createStyleForm = (value: any): FormGroup =>
  formBuilder.group({
    name: [value?.name || 'New rule', Validators.required],
    background: formBuilder.group({
      color: [value?.background?.color || ''],
    }),
    text: formBuilder.group({
      color: [value?.text?.color || ''],
      bold: [value?.text?.bold || false],
      underline: [value?.text?.underline || false],
      italic: [value?.text?.italic || false],
    }),
    fields: [value?.fields || []],
    filter: createFilterGroup(value?.filter || {}),
  });
