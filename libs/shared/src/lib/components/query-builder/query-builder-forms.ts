import { FormBuilder, Validators } from '@angular/forms';
import get from 'lodash/get';
import { QueryField } from '../../services/query-builder/query-builder.service';
import { prettifyLabel } from '../../utils/prettify';
import { FILTER_OPERATORS } from '../filter/filter.const';

/** Creating a new instance of the FormBuilder class. */
const formBuilder = new FormBuilder();

/**
 * Builds a filter form
 *
 * @param filter Initial filter
 * @returns Filter form
 */
export const createFilterGroup = (filter: any) => {
  if (filter?.filters) {
    const filters = filter.filters.map((x: any) => createFilterGroup(x));
    return formBuilder.group({
      logic: filter.logic || 'and',
      filters: formBuilder.array(filters),
    });
  }
  if (filter?.field) {
    const group = formBuilder.group({
      field: filter.field,
      operator: filter.operator || 'eq',
      value: Array.isArray(filter.value) ? [filter.value] : filter.value,
    });
    if (
      FILTER_OPERATORS.find((op) => op.value === filter.operator)?.disableValue
    ) {
      group.get('value')?.disable();
    }
    return group;
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
export const addNewField = (field: any, newField?: boolean) => {
  switch (newField ? field.type.kind : field.kind) {
    case 'LIST': {
      return formBuilder.group({
        name: [{ value: field.name, disabled: true }],
        label: [field.label],
        width: [newField ? null : field.width],
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
        first: [get(field, 'first', null), Validators.min(0)],
        filter: newField
          ? formBuilder.group({})
          : createFilterGroup(field.filter),
      });
    }
    case 'OBJECT': {
      return formBuilder.group({
        name: [{ value: field.name, disabled: true }],
        type: [
          newField
            ? field.type.name
              ? field.type.name
              : field.type.ofType.name
            : field.type,
        ],
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
        width: [newField ? null : field.width],
        format: [get(field, 'format', null)],
      });
    }
  }
};

/**
 * Create a default QueryField from a name only.
 *
 * @param name Name of the field
 * @returns Default QueryField
 */
export const createDefaultField = (name: string): QueryField => ({
  name,
  type: 'String',
  kind: 'SCALAR',
  label: prettifyLabel(name),
});

/**
 * Builds a query form.
 *
 * @param value Initial value
 * @param validators Enables or not the validators of the form
 * @returns Query form
 */
export const createQueryForm = (value: any, validators = true) =>
  formBuilder.group({
    name: [get(value, 'name', ''), validators ? Validators.required : null],
    template: [get(value, 'template', ''), null],
    pageSize: [get(value, 'pageSize', 10)],
    fields: formBuilder.array(
      get(value, 'fields', []).map((x: any) => addNewField(x)),
      validators ? Validators.required : null
    ),
    sort: formBuilder.group({
      field: [get(value, 'sort.field', '')],
      order: [get(value, 'sort.order', 'asc')],
    }),
    filter: createFilterGroup(get(value, 'filter', {})),
    style: formBuilder.array(
      get(value, 'style', []).map((x: any) => createStyleForm(x))
    ),
  });

/**
 * Creates a display form.
 *
 * @param value Initial value.
 * @returns Display form.
 */
export const createDisplayForm = (value: any) =>
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
export const createStyleForm = (value: any) =>
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
