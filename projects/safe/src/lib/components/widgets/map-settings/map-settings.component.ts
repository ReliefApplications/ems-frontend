import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';
import { mapform } from './map-forms';
import { QueryBuilderService } from '../../../services/query-builder.service';

/** Component for the map widget settings */
@Component({
  selector: 'safe-map-settings',
  templateUrl: './map-settings.component.html',
  styleUrls: ['./map-settings.component.scss'],
})
export class SafeMapSettingsComponent implements OnInit {
  // === REACTIVE FORM ===
  tileForm: FormGroup | undefined;

  // === WIDGET ===
  @Input() tile: any;

  // === EMIT THE CHANGES APPLIED ===
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() change: EventEmitter<any> = new EventEmitter();

  public availableFields: any[] = [];
  public selectedFields: any[] = [];
  public formatedSelectedFields: any[] = [];

  /**
   * Get marker rules as form array
   *
   * @returns Markers rules as form array
   */
  get markerRules(): FormArray {
    return this.tileForm?.get('markerRules') as FormArray;
  }

  /**
   * Component for the map widget settings
   *
   * @param queryBuilder Shared query builder service
   */
  constructor(private queryBuilder: QueryBuilderService) {}

  /** Build the settings form, using the widget saved parameters. */
  ngOnInit(): void {
    this.tileForm = mapform(this.tile.id, this.tile.settings);

    this.change.emit(this.tileForm);
    this.tileForm?.valueChanges.subscribe(() => {
      this.change.emit(this.tileForm);
    });

    if (this.tileForm?.value.query.name) {
      this.selectedFields = this.getFields(this.tileForm?.value.query.fields);
      this.formatedSelectedFields = [];
      this.availableFields = this.getAvailableFields();
      console.log(this.availableFields);
      this.availableFields.map((val: any) => {
        if (this.selectedFields.includes(val.name)) {
          this.formatedSelectedFields.push(val);
        }
      });
    }

    if (this.tileForm?.value.query.name) {
      this.selectedFields = this.getFields(this.tileForm?.value.query.fields);
    }

    const queryForm = this.tileForm.get('query') as FormGroup;

    queryForm.controls.name.valueChanges.subscribe(() => {
      this.tileForm?.controls.latitude.setValue('');
      this.tileForm?.controls.longitude.setValue('');
      this.tileForm?.controls.category.setValue('');
    });
    queryForm.valueChanges.subscribe(() => {
      this.selectedFields = this.getFields(queryForm.getRawValue().fields);
      this.formatedSelectedFields = [];
      this.availableFields = this.getAvailableFields();
      this.availableFields.map((val: any) => {
        if (this.selectedFields.includes(val.name)) {
          this.formatedSelectedFields.push(val);
        }
      });
    });
  }

  private getAvailableFields(): any[] {
    const fields = JSON.parse(
      JSON.stringify(
        this.queryBuilder.getFields(this.tileForm?.value.query.name)
      )
    );
    return fields.map((field: any) => {
      console.log(field);
      if (field.type.kind !== 'SCALAR') {
        field.fields = this.queryBuilder
          .getFieldsFromType(
            field.type.kind === 'OBJECT'
              ? field.type.name
              : field.type.ofType.name
          )
          .filter((y) => y.type.name !== 'ID' && y.type.kind === 'SCALAR');
      }
      return field;
    });
  }

  /**
   * Flatten an array
   *
   * @param {any[]} arr - any[] - the array to be flattened
   * @returns the array with all the nested arrays flattened.
   */
  private flatDeep(arr: any[]): any[] {
    return arr.reduce(
      (acc, val) => acc.concat(Array.isArray(val) ? this.flatDeep(val) : val),
      []
    );
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
  private getFields(fields: any[], prefix?: string): any[] {
    return this.flatDeep(
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
}
