import { get } from 'lodash';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  ReferenceData,
  paginationStrategy,
  referenceDataType,
} from '@oort-front/shared';

/**
 * Creates a ReferenceData form from a ReferenceData, if available
 *
 * @param refData Reference data to create the form from
 * @returns ReferenceData form
 */
export const createRefDataForm = (refData?: ReferenceData) => {
  const strategy = get(refData, 'pageInfo.strategy') as paginationStrategy;

  // Create the form group
  const form = new FormGroup({
    name: new FormControl(get(refData, 'name', ''), Validators.required),
    type: new FormControl(
      get(refData, 'type', 'static' as referenceDataType),
      Validators.required
    ),
    valueField: new FormControl(
      get(refData, 'valueField'),
      Validators.required
    ),
    fields: new FormControl(get(refData, 'fields', []), Validators.required),
    apiConfiguration: new FormControl(get(refData, 'apiConfiguration.id')),
    query: new FormControl(get(refData, 'query')),
    path: new FormControl(get(refData, 'path')),
    data: new FormControl(get(refData, 'data')),
    usePagination: new FormControl(!!get(refData, 'pageInfo.strategy')),
    pageInfo: new FormGroup({
      strategy: new FormControl(get(refData, 'pageInfo.strategy')),
      totalCountField: new FormControl(
        get(refData, 'pageInfo.totalCountField')
      ),
      pageSizeVar: new FormControl(get(refData, 'pageInfo.pageSizeVar')),
      cursorVar: new FormControl(
        strategy === 'cursor' ? get(refData, 'pageInfo.cursorVar') || '' : null
      ),
      cursorField: new FormControl(
        strategy === 'cursor'
          ? get(refData, 'pageInfo.cursorField') || ''
          : null
      ),
      offsetVar: new FormControl(
        strategy === 'offset' ? get(refData, 'pageInfo.offsetVar') || '' : null
      ),
      pageVar: new FormControl(
        strategy === 'page' ? get(refData, 'pageInfo.pageVar') || '' : null
      ),
    }),
  });

  // Form control for the pagination fields
  const controls: any = {
    strategy: {
      getValue: () => form.get('pageInfo.strategy')?.value,
      setValue: (value: paginationStrategy | null) => {
        form.get('pageInfo.strategy')?.setValue(value);
      },
    },
    offsetVar: {
      getValue: () => form.get('pageInfo.offsetVar')?.value,
      setValue: (value: string | null) => {
        form.get('pageInfo.offsetVar')?.setValue(value);
      },
    },
    cursorVar: {
      getValue: () => form.get('pageInfo.cursorVar')?.value,
      setValue: (value: string | null) => {
        form.get('pageInfo.cursorVar')?.setValue(value);
      },
    },
    cursorField: {
      getValue: () => form.get('pageInfo.cursorField')?.value,
      setValue: (value: string | null) => {
        form.get('pageInfo.cursorField')?.setValue(value);
      },
    },
    pageVar: {
      getValue: () => form.get('pageInfo.pageVar')?.value,
      setValue: (value: string | null) => {
        form.get('pageInfo.pageVar')?.setValue(value);
      },
    },
    pageSizeVar: {
      getValue: () => form.get('pageInfo.pageSizeVar')?.value,
      setValue: (value: string | null) => {
        form.get('pageInfo.pageSizeVar')?.setValue(value);
      },
    },
    totalCountField: {
      getValue: () => form.get('pageInfo.totalCountField')?.value,
      setValue: (value: string | null) => {
        form.get('pageInfo.totalCountField')?.setValue(value);
      },
    },
  };

  Object.keys(controls).forEach((key) => {
    // Add required validator
    controls[key].require = () => {
      // Get the corresponding control
      const control = form.get(`pageInfo.${key}`);
      if (!control) {
        return;
      }

      // If already required, no need to add the validator
      const isRequired = control.hasValidator(Validators.required);
      if (isRequired) {
        return;
      }

      control.addValidators(Validators.required);
      control.updateValueAndValidity();
    };

    // Remove required validator
    controls[key].optional = () => {
      // Get the corresponding control
      const control = form.get(`pageInfo.${key}`);
      if (!control) {
        return;
      }

      // If already optional, no need to remove the validator
      const isOptional = !control.hasValidator(Validators.required);
      if (isOptional) {
        return;
      }

      control.removeValidators([Validators.required]);
      control.updateValueAndValidity();
    };
  });

  return { form, controls };
};
