import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import get from 'lodash/get';
import { GridType } from 'angular-gridster2';

/** Form builder */
const fb = new FormBuilder();

/** Default grid options for gridster */
const DEFAULT_GRID_OPTIONS = {
  minCols: 8,
  fixedRowHeight: 200,
  minimumHeight: 0,
  margin: 10,
  gridType: GridType.VerticalFixed,
};

/**
 * Create tab form group
 *
 * @param value initial value
 * @returns tab form group
 */
export const createTabFormGroup = (value?: any) => {
  const formGroup = fb.group({
    label: fb.nonNullable.control<string>(value?.label, Validators.required),
    gridOptions: fb.group({
      minCols: fb.control(
        get<number>(value.gridOptions, 'minCols', DEFAULT_GRID_OPTIONS.minCols),
        Validators.compose([Validators.min(4), Validators.max(24)])
      ),
      gridType: fb.control(
        get<GridType>(
          value.gridOptions,
          'gridType',
          DEFAULT_GRID_OPTIONS.gridType
        )
      ),
      fixedRowHeight: fb.control(
        get<number>(
          value.gridOptions,
          'fixedRowHeight',
          DEFAULT_GRID_OPTIONS.fixedRowHeight
        ),
        Validators.min(50)
      ),
      minimumHeight: fb.control(
        get<number>(
          value.gridOptions,
          'minimumHeight',
          DEFAULT_GRID_OPTIONS.minimumHeight
        ),
        Validators.min(0)
      ),
      margin: fb.control(
        get<number>(value.gridOptions, 'margin', DEFAULT_GRID_OPTIONS.margin),
        Validators.min(0)
      ),
    }),
    structure: fb.control(value?.structure || []),
  });
  return formGroup;
};

/**
 * Create tabs widget form group
 *
 * @param id widget id
 * @param value initial value
 * @returns tabs widget form group
 */
export const createTabsWidgetFormGroup = (
  id: string,
  value: any
): FormGroup => {
  const formGroup = fb.group({
    id,
    tabs: fb.array(
      (get(value, 'tabs') || []).map((x: any) => createTabFormGroup(x))
    ),
  });
  return formGroup;
};
