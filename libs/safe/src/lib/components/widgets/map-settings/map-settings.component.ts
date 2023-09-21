import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { createMapWidgetFormGroup } from './map-forms';
import { UntypedFormGroup, UntypedFormArray } from '@angular/forms';
import { QueryBuilderService } from '../../../services/query-builder/query-builder.service';
import { debounceTime } from 'rxjs/operators';
import { cloneDeep } from 'lodash';
import { extendWidgetForm } from '../common/display-settings/extendWidgetForm';
import { flatDeep } from '../../../utils/array-filter';

/**
 * Filters an array of fields to only include fields that match the given paths.
 *
 * @param allFields the array of fields to filter
 * @param paths the paths to match
 * @returns the filtered array of fields
 */
const filterFields = (
  allFields: any[],
  paths: (string | undefined)[]
): any[] => {
  const filteredPaths = paths.filter((path) => path !== undefined) as string[];

  // Helper function to recursively search for a field
  // with the given name in the given array of fields.
  const findField = (name: string, fields: any[]): any | undefined => {
    const path = name.split('.');
    const rootField = path.shift();
    let field = fields.find((f: any) => f.name === rootField);
    if (!field) {
      return undefined;
    }

    for (const part of path) {
      if (!field?.fields) {
        return undefined;
      }
      field = field.fields.find((f: any) => f.name === part);
      if (!field) {
        return undefined;
      }
    }

    return field;
  };

  const includedFields: any[] = filteredPaths.reduce((acc, path) => {
    if (!path) return acc;
    const pathParts = path.split('.');
    const currentPath: string[] = [];
    for (const part of pathParts) {
      currentPath.push(part);
      const existingField = findField(currentPath.join('.'), acc);
      if (!existingField) {
        const field = findField(currentPath.join('.'), allFields);
        if (field) {
          const newField = cloneDeep(field);

          // if has fields, remove them
          if (newField.fields) newField.fields = [];

          // if has a parent, add to parent
          const parentField = findField(
            currentPath.splice(0, currentPath.length - 1).join('.'),
            acc
          );
          if (parentField) parentField.fields?.push(newField);

          // if no parent, add to root
          if (!parentField) acc.push(newField);
        }
      }
    }

    return acc;
  }, [] as any[]);

  return includedFields;
};

/** Component for the map widget settings */
@Component({
  selector: 'safe-map-settings',
  templateUrl: './map-settings.component.html',
  styleUrls: ['./map-settings.component.scss'],
})
export class SafeMapSettingsComponent implements OnInit {
  // === REACTIVE FORM ===
  tileForm: UntypedFormGroup | undefined;

  // === WIDGET ===
  @Input() tile: any;

  // === EMIT THE CHANGES APPLIED ===
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() change: EventEmitter<any> = new EventEmitter();

  public selectedFields: (string | undefined)[] = [];
  public formattedSelectedFields: any[] = [];

  /**
   * Get marker rules as form array
   *
   * @returns Markers rules as form array
   */
  get markerRules(): UntypedFormArray {
    return this.tileForm?.get('markerRules') as UntypedFormArray;
  }

  /**
   * Component for the map widget settings
   *
   * @param queryBuilder Shared query builder service
   */
  constructor(private queryBuilder: QueryBuilderService) {}

  /** Build the settings form, using the widget saved parameters. */
  ngOnInit(): void {
    this.tileForm = extendWidgetForm(
      createMapWidgetFormGroup(this.tile.id, this.tile.settings),
      this.tile.settings?.widgetDisplay
    );

    this.change.emit(this.tileForm);
    this.tileForm?.valueChanges.subscribe(() => {
      this.change.emit(this.tileForm);
    });

    if (this.tileForm?.value.query.name) {
      this.selectedFields = this.getFields(this.tileForm?.value.query.fields);
      this.queryBuilder
        .getFilterFields(this.tileForm?.value.query)
        .then((fields) => {
          this.formattedSelectedFields = filterFields(
            fields,
            this.selectedFields
          );
        });
    }

    const queryForm = this.tileForm.get('query') as UntypedFormGroup;

    queryForm.controls.name.valueChanges.subscribe((value) => {
      // Prevent to erase everything when queryName does not change
      if (value !== queryForm.value.name) {
        this.tileForm?.controls.latitude.setValue('');
        this.tileForm?.controls.longitude.setValue('');
        this.tileForm?.controls.category.setValue('');
      }
    });
    queryForm.valueChanges.pipe(debounceTime(1000)).subscribe(() => {
      const query = queryForm.getRawValue();
      if (query.name.startsWith('all')) {
        this.selectedFields = this.getFields(query.fields);
        this.queryBuilder.getFilterFields(query).then((fields) => {
          this.formattedSelectedFields = filterFields(
            fields,
            this.selectedFields
          );
        });
      }
    });
  }

  /**
   * Take an array of fields, and return an array of strings that represent
   * the fields
   *
   * @param {any[]} fields - any[] - this is the array of fields that we want to
   * flatten
   * @param {string} [prefix] - The prefix is the name of the parent object. For
   * example, if you have a field called "user" and it's an object, the prefix will
   * be "user".
   * @returns An array of strings.
   */
  private getFields(fields: any[], prefix?: string): (string | undefined)[] {
    return flatDeep(
      fields
        .filter((x) => x.kind !== 'LIST')
        .map((f) => {
          switch (f.kind) {
            case 'OBJECT': {
              return this.getFields(f.fields, f.name);
            }
            default: {
              return prefix ? `${prefix}.${f.name}` : f.name;
            }
          }
        })
    );
  }

  /**
   * Filter the query fields to only get those in the selectedFields
   *
   * @param queryFields All the fields obtained by query
   * @param selectedFields The concatenated names of the selected fields
   * @returns A list of formated seected fields
   */
  // private getFormattedSelectedFields(
  //   queryFields: any[],
  //   selectedFields: (string | undefined)[]
  // ): any[] {
  //   const rootFields = selectedFields.map((field) => field?.split('.')[0]);
  //   return queryFields
  //     .filter((queryField) => rootFields.includes(queryField.name))
  //     .map((queryField) => {
  //       const formatedFields = queryField.fields
  //         ? this.getFormattedSelectedFields(
  //             queryField.fields,
  //             selectedFields
  //               .filter((field) => field?.split('.')[0] === queryField.name)
  //               .map((field) => field?.split('.').slice(1).join('.'))
  //           )
  //         : null;
  //       return {
  //         ...queryField,
  //         ...(formatedFields ? { fields: formatedFields } : {}),
  //       };
  //     });
  // }
}
