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
      this.availableFields = this.getAvailableFields();
    }

    const queryForm = this.tileForm.get('query') as FormGroup;

    queryForm.controls.name.valueChanges.subscribe(() => {
      this.tileForm?.controls.latitude.setValue('');
      this.tileForm?.controls.longitude.setValue('');
      this.tileForm?.controls.category.setValue('');
    });
    queryForm.valueChanges.subscribe(() => {
      this.availableFields = this.getAvailableFields();
    });
  }

  /**
   * Get list of all available fields
   *
   * @returns List of available fields
   */
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
}
