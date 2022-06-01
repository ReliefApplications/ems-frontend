import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SafeArcGISService } from '../../../services/arc-gis.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { createQueryForm } from './map-forms';

/**
 * Settings component of map widget.
 */
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

  constructor(
    private formBuilder: FormBuilder,
    private arcGisService: SafeArcGISService
  ) {}

  /**
   * Builds the settings form, using the widget saved parameters.
   */
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
      this.tileForm?.controls.category.setValue('');
    });
    queryForm.valueChanges.subscribe((res) => {
      this.selectedFields = this.getFields(queryForm.getRawValue().fields);
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
   * Utility to have a flat copy of an array.
   *
   * @param arr array to flatten
   * @returns flat copy of the array
   */
  private flatDeep(arr: any[]): any[] {
    return arr.reduce(
      (acc, val) => acc.concat(Array.isArray(val) ? this.flatDeep(val) : val),
      []
    );
  }

  /**
   * Gets flat copy of the fields.
   *
   * @param fields form fields
   * @param prefix object prefix
   * @returns flap copy of fields
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
}
