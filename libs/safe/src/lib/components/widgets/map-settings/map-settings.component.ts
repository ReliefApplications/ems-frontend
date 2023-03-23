import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { createMapWidgetFormGroup } from './map-forms';
import { UntypedFormGroup } from '@angular/forms';
import {
  MapConstructorSettings,
  MapEvent,
  MapEventType,
} from '../../ui/map/interfaces/map.interface';
import { takeUntil } from 'rxjs';
import { SafeUnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';

/** Component for the map widget settings */
@Component({
  selector: 'safe-map-settings',
  templateUrl: './map-settings.component.html',
  styleUrls: ['./map-settings.component.scss'],
})
export class SafeMapSettingsComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  public currentTab: 'parameters' | 'layers' | null = 'parameters';
  public mapSettings!: MapConstructorSettings;

  // === REACTIVE FORM ===
  tileForm: UntypedFormGroup | undefined;

  // === WIDGET ===
  @Input() tile: any;

  // === EMIT THE CHANGES APPLIED ===
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() change: EventEmitter<any> = new EventEmitter();

  /**
   * Class constructor
   */
  constructor() {
    super();
  }

  /** Build the settings form, using the widget saved parameters. */
  ngOnInit(): void {
    this.tileForm = createMapWidgetFormGroup(this.tile.id, this.tile.settings);
    this.change.emit(this.tileForm);

    const defaultMapSettings: MapConstructorSettings = {
      basemap: this.tileForm.value.basemap,
      initialState: this.tileForm.get('initialState')?.value,
      controls: this.tileForm.value.controls,
      arcGisWebMap: this.tileForm.value.arcGisWebMap,
      layers: this.tileForm.value.layers,
    };
    this.updateMapSettings(defaultMapSettings);
    this.setUpFormListeners();
  }

  /**
   * Set form listeners
   */
  private setUpFormListeners() {
    if (!this.tileForm) return;

    this.tileForm?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.change.emit(this.tileForm);
    });
    this.tileForm
      .get('initialState')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) =>
        this.updateMapSettings({
          initialState: value,
        } as MapConstructorSettings)
      );
    this.tileForm
      .get('basemap')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) =>
        this.updateMapSettings({ basemap: value } as MapConstructorSettings)
      );
    this.tileForm
      .get('controls')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.updateMapSettings({
          controls: value,
        } as MapConstructorSettings);
      });
    this.tileForm
      .get('arcGisWebMap')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) =>
        this.updateMapSettings({
          arcGisWebMap: value,
        } as MapConstructorSettings)
      );
  }

  /**
   * Handle leaflet map events
   *
   * @param event leaflet map event
   */
  handleMapEvent(event: MapEvent) {
    if (!this.tileForm) return;
    switch (event.type) {
      case MapEventType.MOVE_END:
        this.mapSettings.initialState.viewpoint.center.latitude =
          event.content.center.lat;
        this.mapSettings.initialState.viewpoint.center.longitude =
          event.content.center.lng;
        break;
      case MapEventType.ZOOM_END:
        this.mapSettings.initialState.viewpoint.zoom = event.content.zoom;
        this.tileForm
          .get('initialState.viewpoint.zoom')
          ?.setValue(this.mapSettings.initialState.viewpoint.zoom, {
            emitEvent: false,
          });
        break;
      default:
        break;
    }
  }

  /**
   * Update map settings
   *
   * @param settings new settings
   */
  private updateMapSettings(settings: MapConstructorSettings) {
    if (this.mapSettings) {
      this.mapSettings = {
        ...this.mapSettings,
        ...settings,
      };
    } else {
      this.mapSettings = settings;
    }
  }
}

// ------- LEGACY CODE -------
// import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
// import { createMapWidgetFormGroup } from './map-forms';
// import { FormGroup, FormArray } from '@angular/forms';
// import { QueryBuilderService } from '../../../services/query-builder/query-builder.service';
// import { debounceTime } from 'rxjs/operators';
// import { cloneDeep } from 'lodash';

// /**
//  * Filters an array of fields to only include fields that match the given paths.
//  *
//  * @param allFields the array of fields to filter
//  * @param paths the paths to match
//  * @returns the filtered array of fields
//  */
//  const filterFields = (
//   allFields: any[],
//   paths: (string | undefined)[]
// ): any[] => {
//   const filteredPaths = paths.filter((path) => path !== undefined) as string[];

//   // Helper function to recursively search for a field
//   // with the given name in the given array of fields.
//   const findField = (name: string, fields: any[]): any | undefined => {
//     const path = name.split('.');
//     const rootField = path.shift();
//     let field = fields.find((f: any) => f.name === rootField);
//     if (!field) {
//       return undefined;
//     }

//     for (const part of path) {
//       if (!field?.fields) {
//         return undefined;
//       }
//       field = field.fields.find((f: any) => f.name === part);
//       if (!field) {
//         return undefined;
//       }
//     }

//     return field;
//   };

//   const includedFields: any[] = filteredPaths.reduce((acc, path) => {
//     if (!path) return acc;
//     const pathParts = path.split('.');
//     const currentPath: string[] = [];
//     for (const part of pathParts) {
//       currentPath.push(part);
//       const existingField = findField(currentPath.join('.'), acc);
//       if (!existingField) {
//         const field = findField(currentPath.join('.'), allFields);
//         if (field) {
//           const newField = cloneDeep(field);

//           // if has fields, remove them
//           if (newField.fields) newField.fields = [];

//           // if has a parent, add to parent
//           const parentField = findField(
//             currentPath.splice(0, currentPath.length - 1).join('.'),
//             acc
//           );
//           if (parentField) parentField.fields?.push(newField);

//           // if no parent, add to root
//           if (!parentField) acc.push(newField);
//         }
//       }
//     }

//     return acc;
//   }, [] as any[]);

//   return includedFields;
// };

// /** Component for the map widget settings */
// @Component({
//   selector: 'safe-map-settings',
//   templateUrl: './map-settings.component.html',
//   styleUrls: ['./map-settings.component.scss'],
// })
// export class SafeMapSettingsComponent implements OnInit {
//   // === REACTIVE FORM ===
//   tileForm: FormGroup | undefined;

//   // === WIDGET ===
//   @Input() tile: any;

//   // === EMIT THE CHANGES APPLIED ===
//   // eslint-disable-next-line @angular-eslint/no-output-native
//   @Output() change: EventEmitter<any> = new EventEmitter();

//   public selectedFields: (string | undefined)[] = [];
//   public formattedSelectedFields: any[] = [];

//   /**
//    * Get marker rules as form array
//    *
//    * @returns Markers rules as form array
//    */
//   get markerRules(): FormArray {
//     return this.tileForm?.get('markerRules') as FormArray;
//   }

//   /**
//    * Component for the map widget settings
//    *
//    * @param queryBuilder Shared query builder service
//    */
//   constructor(private queryBuilder: QueryBuilderService) {}

//   /** Build the settings form, using the widget saved parameters. */
//   ngOnInit(): void {
//     this.tileForm = createMapWidgetFormGroup(this.tile.id, this.tile.settings);

//     this.change.emit(this.tileForm);
//     this.tileForm?.valueChanges.subscribe(() => {
//       this.change.emit(this.tileForm);
//     });

//     if (this.tileForm?.value.query.name) {
//       this.selectedFields = this.getFields(this.tileForm?.value.query.fields);
//       this.queryBuilder
//         .getFilterFields(this.tileForm?.value.query)
//         .then((fields) => {
//           this.formattedSelectedFields = filterFields(
//             fields,
//             this.selectedFields
//           );
//         });
//     }

//     const queryForm = this.tileForm.get('query') as FormGroup;

//     queryForm.controls.name.valueChanges.subscribe((value) => {
//       // Prevent to erase everything when queryName does not change
//       if (value !== queryForm.value.name) {
//         this.tileForm?.controls.latitude.setValue('');
//         this.tileForm?.controls.longitude.setValue('');
//         this.tileForm?.controls.category.setValue('');
//       }
//     });
//     queryForm.valueChanges.pipe(debounceTime(1000)).subscribe(() => {
//       const query = queryForm.getRawValue();
//       if (query.name.startsWith('all')) {
//         this.selectedFields = this.getFields(query.fields);
//         this.queryBuilder.getFilterFields(query).then((fields) => {
//           this.formattedSelectedFields = filterFields(
//             fields,
//             this.selectedFields
//           );
//         });
//       }
//     });
//   }

//   /**
//    * Flatten an array
//    *
//    * @param {any[]} arr - any[] - the array to be flattened
//    * @returns the array with all the nested arrays flattened.
//    */
//   private flatDeep(arr: any[]): any[] {
//     return arr.reduce(
//       (acc, val) => acc.concat(Array.isArray(val) ? this.flatDeep(val) : val),
//       []
//     );
//   }

//   /**
//    * Take an array of fields, and return an array of strings that represent
//    * the fields
//    *
//    * @param {any[]} fields - any[] - this is the array of fields that we want to
//    * flatten
//    * @param {string} [prefix] - The prefix is the name of the parent object. For
//    * example, if you have a field called "user" and it's an object, the prefix will
//    * be "user".
//    * @returns An array of strings.
//    */
//   private getFields(fields: any[], prefix?: string): (string | undefined)[] {
//     return this.flatDeep(
//       fields
//         .filter((x) => x.kind !== 'LIST')
//         .map((f) => {
//           switch (f.kind) {
//             case 'OBJECT': {
//               return this.getFields(f.fields, f.name);
//             }
//             default: {
//               return prefix ? `${prefix}.${f.name}` : f.name;
//             }
//           }
//         })
//     );
//   }

//   /**
//    * Filter the query fields to only get those in the selectedFields
//    *
//    * @param queryFields All the fields obtained by query
//    * @param selectedFields The concatenated names of the selected fields
//    * @returns A list of formated seected fields
//    */
//   // private getFormattedSelectedFields(
//   //   queryFields: any[],
//   //   selectedFields: (string | undefined)[]
//   // ): any[] {
//   //   const rootFields = selectedFields.map((field) => field?.split('.')[0]);
//   //   return queryFields
//   //     .filter((queryField) => rootFields.includes(queryField.name))
//   //     .map((queryField) => {
//   //       const formatedFields = queryField.fields
//   //         ? this.getFormattedSelectedFields(
//   //             queryField.fields,
//   //             selectedFields
//   //               .filter((field) => field?.split('.')[0] === queryField.name)
//   //               .map((field) => field?.split('.').slice(1).join('.'))
//   //           )
//   //         : null;
//   //       return {
//   //         ...queryField,
//   //         ...(formatedFields ? { fields: formatedFields } : {}),
//   //       };
//   //     });
//   // }
// }
