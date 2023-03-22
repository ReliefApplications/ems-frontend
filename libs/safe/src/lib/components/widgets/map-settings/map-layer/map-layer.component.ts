import {
  Component,
  Input,
  TemplateRef,
  ViewChild,
  OnInit,
} from '@angular/core';
import { Layer } from '../../../../models/layer.model';
import { createLayerForm, LayerFormT } from '../map-forms';

/**
 *
 */
@Component({
  selector: 'safe-map-layer',
  templateUrl: './map-layer.component.html',
  styleUrls: ['./map-layer.component.scss'],
})
export class MapLayerComponent implements OnInit {
  @ViewChild('layerNavigationTemplate')
  layerNavigationTemplate!: TemplateRef<any>;

  @ViewChild('layerSettingsTemplate')
  layerSettingsTemplate!: TemplateRef<any>;

  public currentTab: 'parameters' | 'fields' | 'datasource' | null =
    'parameters';
  public form!: LayerFormT;

  @Input() layer?: Layer;

  ngOnInit(): void {
    this.form = createLayerForm(this.layer);
  }
}

// private currentLayer: L.Layer | null = null;
// private layerOptions: any = {};

// /** @returns the selected layer type */
// public get layerType() {
//   return this.form.get('type')?.value || null;
// }
// /** @returns the selected icon with the given style config */
// private get icon() {
//   const style = this.form.get('style')?.value;
//   if (!style) return null;

//   return createCustomDivIcon({
//     icon: style.icon || DEFAULT_MARKER_ICON_OPTIONS.icon,
//     color: style.color || DEFAULT_MARKER_ICON_OPTIONS.color,
//     size: style.size || DEFAULT_MARKER_ICON_OPTIONS.size,
//     opacity:
//       this.form.get('opacity')?.value || DEFAULT_MARKER_ICON_OPTIONS.opacity,
//   });
// }

// // === MAP ===
// public mapSettings!: MapConstructorSettings;
// private addOrDeleteLayer: BehaviorSubject<LayerActionOnMap | null> =
//   new BehaviorSubject<LayerActionOnMap | null>(null);
// public layerToAddOrDelete$ = this.addOrDeleteLayer.asObservable();
// private updateLayer: BehaviorSubject<any> = new BehaviorSubject<any>(null);
// public updateLayer$ = this.updateLayer.asObservable();

// /**
//  * Modal for adding and editing map layers
//  *
//  * @param safeMapLayerService Service needed to create the icon for point type layer
//  * @param layer Injected map layer, if any
//  */
// constructor(
//   private safeMapLayerService: SafeMapLayersService,
//   @Inject(MAT_DIALOG_DATA) public layer?: MapLayerI
// ) {
//   super();
//   this.form = createLayerForm(layer);
// }

// ngOnInit(): void {
//   this.configureMapSettings();
// }

// ngAfterViewInit(): void {
//   if (this.layerType) {
//     this.setUpLayer();
//   }
//   this.setUpEditLayerListeners();
// }

// /**
//  * Configure map settings
//  */
// private configureMapSettings() {
//   this.mapSettings = {
//     initialState: {
//       viewpoint: {
//         center: {
//           latitude: 0,
//           longitude: 0,
//         },
//         zoom: 2,
//       },
//     },
//     maxBounds: [
//       [-90, -1000],
//       [90, 1000],
//     ],
//     basemap: 'OSM',
//     zoomControl: false,
//     minZoom: 2,
//     maxZoom: 18,
//     worldCopyJump: true,
//     controls: DefaultMapControls,
//   };
// }

// /**
//  * Update layer options
//  *
//  * @param options new options
//  */
// private updateLayerOptions(options?: { [key: string]: any }) {
//   this.layerOptions = {
//     ...this.layerOptions,
//     ...(options && options),
//   };
//   this.updateLayer.next({
//     layer: this.currentLayer,
//     options: this.layerOptions,
//     ...(this.layerType === 'point' && { icon: this.icon }),
//   });
// }

// /**
//  * Set edit layers listeners.
//  */
// private setUpEditLayerListeners() {
//   if (!this.form.controls) return;
//   this.form.controls.visibilityRangeStart.valueChanges
//     .pipe(takeUntil(this.destroy$))
//     .subscribe((value) => {
//       this.updateLayerOptions({
//         visibilityRange: [value, this.form.controls.visibilityRangeEnd.value],
//       });
//     });
//   this.form.controls.visibilityRangeEnd.valueChanges
//     .pipe(takeUntil(this.destroy$))
//     .subscribe((value) => {
//       this.updateLayerOptions({
//         visibilityRange: [
//           this.form.controls.visibilityRangeStart.value,
//           value,
//         ],
//       });
//     });

//   this.form.controls.opacity.valueChanges
//     .pipe(takeUntil(this.destroy$))
//     .subscribe((value) => {
//       this.updateLayerOptions({ opacity: value, fillOpacity: value });
//     });

//   this.form.controls.name.valueChanges
//     .pipe(takeUntil(this.destroy$))
//     .subscribe((value) => {
//       this.updateLayerOptions({ name: value });
//     });

//   this.form.controls.defaultVisibility.valueChanges
//     .pipe(takeUntil(this.destroy$))
//     .subscribe((value) => {
//       this.updateLayerOptions({ visible: value });
//     });

//   // apply marker style changes
//   this.form
//     .get('style')
//     ?.valueChanges.pipe(takeUntil(this.destroy$))
//     .subscribe(() => {
//       if (this.layerType === 'point') {
//         this.updateLayerOptions();
//       }
//     });
//   this.form
//     .get('type')
//     ?.valueChanges.pipe(takeUntil(this.destroy$))
//     .subscribe(() => {
//       if (this.layerType === 'point' || this.layerType === 'polygon')
//         this.setUpLayer();
//     });
// }

// /**
//  * Set ups the new selected layer and also removes the previous one
//  */
// private setUpLayer() {
//   // If a layer is already applied to the map we first delete it
//   if (this.currentLayer) {
//     this.addOrDeleteLayer.next({
//       layerData: {
//         layer: this.currentLayer,
//         label: this.form.get('name')?.value || '',
//       },
//       isDelete: true,
//     });
//   }
//   if (this.layerType) {
//     this.currentLayer = L.geoJSON(TEST_LAYER[this.layerType]);

//     const defaultLayerOptions = {
//       visibilityRange: [
//         this.form?.get('visibilityRangeStart')?.value,
//         this.form?.get('visibilityRangeEnd')?.value,
//       ],
//       opacity: this.form?.get('opacity')?.value,
//       fillOpacity: this.form?.get('opacity')?.value,
//       visible: this.form?.get('defaultVisibility')?.value,
//       style: this.form?.get('style')?.value,
//     };
//     const overlays: OverlayLayerTree = {
//       layer: this.currentLayer,
//       label: this.form.get('name')?.value || '',
//       options: defaultLayerOptions,
//     };

//     // Then we use a timeout to add the new layer in order to delete the previous layer if so
//     setTimeout(() => {
//       this.addOrDeleteLayer.next({ layerData: overlays, isDelete: false });
//     }, 0);

//     this.updateLayerOptions(defaultLayerOptions);
//   }
// }
// /**
//  * Handle leaflet map events
//  *
//  * @param event leaflet map event
//  */
// public handleMapEvent(event: MapEvent) {
//   if (event) {
//     switch (event.type) {
//       case MapEventType.ZOOM_END:
//         this.mapSettings.initialState.viewpoint.zoom = event.content.zoom;
//         const visibilityRange = [
//           this.form.get('visibilityRangeStart')?.value,
//           this.form.get('visibilityRangeEnd')?.value,
//         ];
//         if (this.currentLayer) {
//           this.updateLayerOptions({ visibilityRange });
//         }
//         break;
//       default:
//         break;
//     }
//   }
// }
