import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormArray } from '@angular/forms';
import { SafeArcGISService } from '../../../services/arc-gis.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { createQueryForm } from './map-forms';
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

  public basemaps: any[] = [
    'Sreets',
    'Navigation',
    'Topographic',
    'Light Gray',
    'Dark Gray',
    'Streets Relief',
    'Imagery',
    'ChartedTerritory',
    'ColoredPencil',
    'Nova',
    'Midcentury',
    'OSM',
    'OSM:Streets',
  ];

  public search = '';
  private searchChanged: Subject<string> = new Subject<string>();
  public availableLayers: any[] = [];

  /**
   * Constructor of the component
   *
   * @param formBuilder Create the formbuilder
   * @param arcGisService Shared ArcGIS service, enables to use esri features
   */
  constructor(
    private formBuilder: FormBuilder,
    private arcGisService: SafeArcGISService,
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
      category: [
        tileSettings && tileSettings.category ? tileSettings.category : null,
      ],
      basemap: [
        tileSettings && tileSettings.basemap ? tileSettings.basemap : null,
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
      onlineLayers: [
        tileSettings && tileSettings.onlineLayers
          ? tileSettings.onlineLayers
          : [],
      ],
      pointerRules: [
        tileSettings && tileSettings.pointerRules
          ? this.formatPointerRules(tileSettings.pointerRules)
          : this.formBuilder.array([]),
      ],
      clorophlets: [
        tileSettings && tileSettings.clorophlets
          ? this.formatClorophlets(tileSettings.clorophlets)
          : this.formBuilder.array([], [Validators.required]),
      ],
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

    this.arcGisService.clearSelectedLayer();
    this.arcGisService.searchLayers('');

    this.arcGisService.availableLayers$.subscribe((suggestions) => {
      this.availableLayers = suggestions;
    });

    this.arcGisService.selectedLayer$.subscribe((item) => {
      if (item.id) {
        const temp: any[] = [];
        this.tileForm?.value.onlineLayers.map((layer: any) => {
          temp.push(layer);
        });
        temp.push(item);
        this.tileForm?.controls.onlineLayers.setValue(temp);
      }
    });

    this.searchChanged
      .pipe(
        debounceTime(300), // wait 300ms after the last event before emitting last event
        distinctUntilChanged()
      ) // only emit if value is different from previous value
      .subscribe((search) => {
        this.arcGisService.searchLayers(search);
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

  /**
   * Get Search layers content.
   *
   * @param search search text value
   */
  public getContent(search: string): void {
    this.searchChanged.next(search);
  }

  /**
   * Selects a new layer.
   *
   * @param layer layer to select.
   */
  public addOnlineLayer(layer: any): void {
    this.search = '';
    this.arcGisService.searchLayers('');
    this.arcGisService.getLayer(layer.id);
  }

  /**
   * Removes a layer.
   *
   * @param id id of layer to remove
   */
  public removeOnlineLayer(id: any): void {
    const temp: any[] = [];
    this.tileForm?.value.onlineLayers.map((layer: any) => {
      if (layer.id !== id) {
        temp.push(layer);
      }
    });
    this.tileForm?.controls.onlineLayers.setValue(temp);
  }

  /**
   * Adds a new pointer rule.
   */
  public addPointerRule(): void {
    this.tileForm?.value.pointerRules.push(
      this.formBuilder.group({
        color: ['#0090d1'],
        size: [1],
        filter: this.formBuilder.group({
          logic: ['and'],
          filters: this.formBuilder.array([]),
        }),
      })
    );
  }

  /**
   * Removes a pointer rule.
   *
   * @param index position of the pointer rule to delete.
   */
  public removePointerRule(index: number): void {
    this.tileForm?.value.pointerRules.removeAt(index);
  }

  /**
   * Transforms the pointer rules array to a it's reactive form.
   *
   * @param value pointer rules array.
   * @returns formated pointer rules array.
   */
  private formatPointerRules(value: any[]): FormArray {
    const formatedPointerRules = this.formBuilder.array([]);
    value.map((val: any) => {
      formatedPointerRules.push(
        this.formBuilder.group({
          color: [val.color],
          size: [val.size],
          filter: this.formBuilder.group({
            logic: [val.filter.logic],
            filters: this.formatFilters(val.filter.filters),
          }),
        })
      );
    });
    return formatedPointerRules;
  }

  /**
   * Adds a new clorophlet.
   */
  public addClorophlet(): void {
    this.tileForm?.value.clorophlets.push(
      this.formBuilder.group({
        name: ['New clorophlet', [Validators.required]],
        geoJSON: ['', [Validators.required]],
        geoJSONname: ['', [Validators.required]],
        geoJSONfield: ['', [Validators.required]],
        opacity: [100],
        place: ['', [Validators.required]],
        divisions: this.formBuilder.array([]),
      })
    );
    this.geoJSONfields.push([]);
  }

  /**
   * Removes a clorophlets.
   *
   * @param index position of the clorophlet to delete.
   */
  public removeClorophlet(index: number): void {
    this.tileForm?.value.clorophlets.removeAt(index);
    this.geoJSONfields.splice(index, 1);
  }

  /**
   * Adds a new division.
   *
   * @param form
   */
  public newDivision(form: any): void {
    form.controls.divisions.push(
      this.formBuilder.group({
        label: [''],
        color: ['#0090d1'],
        filter: this.formBuilder.group({
          logic: ['and'],
          filters: this.formBuilder.array([]),
        }),
      })
    );
  }

  /**
   * Removes a division in target form.
   *
   * @param form
   * @param index
   */
  public removeDivision(form: any, index: number): void {
    form.controls.divisions.removeAt(index);
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
        this.tileForm?.value.clorophlets.controls[i].patchValue({
          geoJSONname: file.files[0].name,
          geoJSON: await file.files[0].text(),
        });
        this.updateGeoJSONfields(
          this.tileForm?.value.clorophlets.value[i].geoJSON,
          i
        );
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

  /**
   * Transforms the pointer rules array to it's reactive form.
   *
   * @param value pointer rules array.
   * @returns formated pointer rules array.
   */
  private formatClorophlets(value: any[]): FormArray {
    const formatedClorophlets = this.formBuilder.array(
      [],
      [Validators.required]
    );
    value.map((val: any, i: number) => {
      const divisions = this.formBuilder.array([]);
      val.divisions.map((division: any) => {
        divisions.push(
          this.formBuilder.group({
            label: [division.label],
            color: [division.color],
            filter: this.formBuilder.group({
              logic: [division.filter.logic],
              filters: this.formatFilters(division.filter.filters),
            }),
          })
        );
      });
      formatedClorophlets.push(
        this.formBuilder.group({
          name: [val.name, [Validators.required]],
          geoJSON: [val.geoJSON, [Validators.required]],
          geoJSONname: [val.geoJSONname, [Validators.required]],
          geoJSONfield: [val.geoJSONfield, [Validators.required]],
          opacity: [val.opacity],
          place: [val.place, [Validators.required]],
          divisions,
        })
      );
      if (val.geoJSON) {
        this.updateGeoJSONfields(val.geoJSON, i);
      }
    });
    return formatedClorophlets;
  }

  /**
   * Formats filters values to work with reactive forms.
   *
   * @param filters value of the filters.
   * @returns formated filters array.
   */
  private formatFilters(filters: any[]): FormArray {
    const formatedFilters = this.formBuilder.array([]);
    filters.map((filter: any) => {
      if (filter.filters && filter.logic) {
        formatedFilters.push(
          this.formBuilder.group({
            filters: this.formatFilters(filter.filters),
            logic: [filter.logic],
          })
        );
      } else {
        formatedFilters.push(
          this.formBuilder.group({
            field: [filter.field],
            operator: [filter.operator],
            value: [filter.value],
          })
        );
      }
    });
    return formatedFilters;
  }
}
