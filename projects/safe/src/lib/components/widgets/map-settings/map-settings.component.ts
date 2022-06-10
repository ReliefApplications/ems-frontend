import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { QueryBuilderService } from '../../../services/query-builder.service';
import { createQueryForm } from '../../query-builder/query-builder-forms';

/** Component for the map widget settings */
@Component({
  selector: 'safe-map-settings',
  templateUrl: './map-settings.component.html',
  styleUrls: ['./map-settings.component.scss'],
})
/** Modal content for the settings of the map widgets. */
export class SafeMapSettingsComponent implements OnInit {
  // === REACTIVE FORM ===
  tileForm: FormGroup | undefined;

  // === WIDGET ===
  @Input() tile: any;

  // === EMIT THE CHANGES APPLIED ===
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() change: EventEmitter<any> = new EventEmitter();

  public selectedFields: any[] = [];

  /**
   * Constructor of the component
   *
   * @param formBuilder Create the formbuilder
   * @param queryBuilder The queryBuilder service
   */
  constructor(
    private formBuilder: FormBuilder,
    private queryBuilder: QueryBuilderService
  ) {}

  /** Build the settings form, using the widget saved parameters. */
  ngOnInit(): void {
    const tileSettings = this.tile.settings;
    this.tileForm = this.formBuilder.group({
      id: this.tile.id,
      title: [tileSettings && tileSettings.title ? tileSettings.title : null],
      query: createQueryForm(tileSettings.query),
      latitude: [
        tileSettings && tileSettings.latitude ? tileSettings.latitude : 0,
        [Validators.min(-90), Validators.max(90)],
      ],
      longitude: [
        tileSettings && tileSettings.longitude ? tileSettings.longitude : 0,
        [Validators.min(-180), Validators.max(180)],
      ],
      zoom: [
        tileSettings && tileSettings.zoom ? tileSettings.zoom : 0,
        [Validators.min(0), Validators.max(10)],
      ],
      centerLong: [
        tileSettings && tileSettings.centerLong
          ? tileSettings.centerLong
          : null,
        [Validators.min(-180), Validators.max(180)],
      ],
      centerLat: [
        tileSettings && tileSettings.centerLat ? tileSettings.centerLat : null,
        [Validators.min(-90), Validators.max(90)],
      ],
    });
    this.change.emit(this.tileForm);
    this.tileForm?.valueChanges.subscribe(() => {
      this.change.emit(this.tileForm);
    });

    if (this.tileForm?.value.query.name) {
      this.selectedFields = this.getFields(this.tileForm?.value.query.fields);
    }

    const queryForm = this.tileForm.get('query') as FormGroup;

    queryForm.controls.name.valueChanges.subscribe(() => {
      this.tileForm?.controls.latitude.setValue('');
      this.tileForm?.controls.longitude.setValue('');
    });
    queryForm.valueChanges.subscribe((res) => {
      this.selectedFields = this.getFields(queryForm.getRawValue().fields);
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
   * It takes an array of fields, and returns an array of strings that represent
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
