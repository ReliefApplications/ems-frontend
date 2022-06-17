import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { SafeArcGISService } from '../../../services/arc-gis.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import {
  clorophletForm,
  divisionForm,
  mapform,
  markerRuleForm,
} from './map-forms';
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

  public selectedFields: any[] = [];
  public formatedSelectedFields: any[] = [];
  public geoJSONfields: any[] = [];

  /**
   * Get marker rules as form array
   *
   * @returns Markers rules as form array
   */
  get markerRules(): FormArray {
    return this.tileForm?.get('markerRules') as FormArray;
  }

  /**
   * Get clorophlets as form array.
   *
   * @returns Clorophlets as form array
   */
  get clorophlets(): FormArray {
    return this.tileForm?.get('clorophlets') as FormArray;
  }

  constructor(
    private formBuilder: FormBuilder,
    private arcGisService: SafeArcGISService,
    private queryBuilder: QueryBuilderService
  ) {}

  /** Build the settings form, using the widget saved parameters. */
  ngOnInit(): void {
    this.tileForm = mapform(this.tile.id, this.tile.settings);

    this.clorophlets.value.map((x: any, i: number) => {
      if (x.geoJSON) {
        this.updateGeoJSONfields(x.geoJSON, i);
      } else {
        this.geoJSONfields.push([]);
      }
    });

    this.change.emit(this.tileForm);
    this.tileForm?.valueChanges.subscribe(() => {
      this.change.emit(this.tileForm);
    });

    if (this.tileForm?.value.query.name) {
      this.selectedFields = this.getFields(this.tileForm?.value.query.fields);
      this.formatedSelectedFields = [];
      this.queryBuilder
        .getFields(this.tileForm?.value.query.name)
        .map((val: any) => {
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
    queryForm.valueChanges.subscribe((res) => {
      this.selectedFields = this.getFields(queryForm.getRawValue().fields);
      this.formatedSelectedFields = [];
      this.queryBuilder
        .getFields(this.tileForm?.value.query.name)
        .map((val: any) => {
          if (this.selectedFields.includes(val.name)) {
            this.formatedSelectedFields.push(val);
          }
        });
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

  // === MARKERS ===
  /**
   * Adds a new marker rule.
   */
  public addMarkerRule(): void {
    this.markerRules.push(markerRuleForm());
  }

  /**
   * Removes a marker rule.
   *
   * @param index position of the marker rule to delete.
   */
  public removeMarkerRule(index: number): void {
    this.markerRules.removeAt(index);
  }

  // === CLOROPHLETS ===
  /**
   * Adds a new clorophlet.
   */
  public addClorophlet(): void {
    this.clorophlets.push(clorophletForm());
    this.geoJSONfields.push([]);
  }

  /**
   * Removes a clorophlets.
   *
   * @param index position of the clorophlet to delete.
   */
  public removeClorophlet(index: number): void {
    this.clorophlets.removeAt(index);
    this.geoJSONfields.splice(index, 1);
  }

  /**
   * Adds a new division.
   *
   * @param form clorophlet to add a new division for
   */
  public addDivision(form: any): void {
    const divisions = form.get('divisions') as FormArray;
    divisions.push(divisionForm());
  }

  /**
   * Removes a division in target form.
   *
   * @param form clorophlet to remove a division in
   * @param index index of division to remove
   */
  public removeDivision(form: any, index: number): void {
    const divisions = form.get('divisions') as FormArray;
    divisions.removeAt(index);
  }

  /**
   * Adds a GeoJSON file to the clorophlet.
   *
   * @param index clorophlet position.
   */
  public async uploadGeoJSON(i: number): Promise<void> {
    const file = document.getElementById('file' + i) as HTMLInputElement;
    if (file) {
      if (file.files && file.files.length > 0) {
        this.clorophlets.at(i).patchValue({
          geoJSONname: file.files[0].name,
          geoJSON: await file.files[0].text(),
        });
        this.updateGeoJSONfields(this.clorophlets.at(i).value.geoJSON, i);
      }
    }
  }

  /**
   * Updates the geoJSON selectable fields.
   *
   * @param geoJSON geoJSON to check.
   * @param index clorophlet position.
   */
  private updateGeoJSONfields(geoJSON: string, i: number): void {
    const parsed = JSON.parse(geoJSON);
    this.geoJSONfields[i] = [];
    for (const property of Object.keys(parsed.features[0].properties)) {
      this.geoJSONfields[i].push(property);
    }
  }
}
