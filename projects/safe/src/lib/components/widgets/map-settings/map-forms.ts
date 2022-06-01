import {
  createQueryForm as createMainQueryForm,
  createFilterGroup,
} from '../../query-builder/query-builder-forms';
import { FormBuilder, FormGroup } from '@angular/forms';

const formBuilder = new FormBuilder();

/**
 * Creates a division form array.
 *
 * @param divisions list of divisions
 * @returns form array of divisions
 */
const createDivisionFormArray = (divisions: any[]): any[] => {
  const fomrArray: any[] = [];
  divisions.map((value: any) => {
    fomrArray.push(
      formBuilder.group({
        label: value.label,
        color: value.color,
        filter: createFilterGroup(value.filter, null),
      })
    );
  });
  return fomrArray;
};

/**
 * Creates a clorophlet form array.
 *
 * @param clorophlets list of chlorophets
 * @returns form array of clorophlets
 */
const createClorophletFormArray = (clorophlets: any[]): any[] => {
  const fomrArray: any[] = [];
  clorophlets.map((value: any) => {
    fomrArray.push(
      formBuilder.group({
        name: value.name,
        geoJSON: value.geoJSON,
        geoJSONname: value.geoJSONname,
        geoJSONfield: value.geoJSONfield,
        opacity: value.opacity || 100,
        place: value.place,
        divisions: formBuilder.array(
          createDivisionFormArray(value.divisions ? value.divisions : [])
        ),
      })
    );
  });
  return fomrArray;
};

/**
 * Builds a query form for map.
 *
 * @param value Initial value
 * @param validators Enables or not the validators of the form
 * @returns Query form
 */
export const createQueryForm = (value: any, validators = true): FormGroup => {
  const formGroup = createMainQueryForm(value, validators);
  const clorophlets = formBuilder.array(
    value && value.clorophlets
      ? createClorophletFormArray(value.clorophlets)
      : []
  );
  formGroup.setControl('clorophlets', clorophlets);
  return formGroup;
};
