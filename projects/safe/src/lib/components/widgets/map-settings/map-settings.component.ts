import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  HostListener,
  ElementRef,
} from '@angular/core';
import { mapform } from './map-forms';
import { FormGroup, FormArray } from '@angular/forms';
import { QueryBuilderService } from '../../../services/query-builder/query-builder.service';

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

  // === DISPLAY ===
  public largeDevice = true;

  // === EMIT THE CHANGES APPLIED ===
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() change: EventEmitter<any> = new EventEmitter();

  public selectedFields: (string | undefined)[] = [];
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
   * @param elRef The element reference.
   */
  constructor(
    private queryBuilder: QueryBuilderService,
    private elRef: ElementRef
  ) {}

  /** Build the settings form, using the widget saved parameters. */
  ngOnInit(): void {
    this.resizeTab(window.innerWidth);
    this.tileForm = mapform(this.tile.id, this.tile.settings);

    this.change.emit(this.tileForm);
    this.tileForm?.valueChanges.subscribe(() => {
      this.change.emit(this.tileForm);
    });

    if (this.tileForm?.value.query.name) {
      this.selectedFields = this.getFields(this.tileForm?.value.query.fields);
      this.formatedSelectedFields = this.getFormatedSelectedFields(
        this.queryBuilder.getFields(this.tileForm?.value.query.name),
        this.selectedFields
      );
    }

    const queryForm = this.tileForm.get('query') as FormGroup;

    queryForm.controls.name.valueChanges.subscribe(() => {
      this.tileForm?.controls.latitude.setValue('');
      this.tileForm?.controls.longitude.setValue('');
      this.tileForm?.controls.category.setValue('');
    });
    queryForm.valueChanges.subscribe(() => {
      this.selectedFields = this.getFields(queryForm.getRawValue().fields);
      this.formatedSelectedFields = this.getFormatedSelectedFields(
        this.queryBuilder.getFields(this.tileForm?.value.query.name),
        this.selectedFields
      );
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
  private getFields(fields: any[], prefix?: string): (string | undefined)[] {
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
   * Filter the query fields to only get those in the selectedFields
   *
   * @param queryFields All the fields obtained by query
   * @param selectedFields The concatenated names of the selected fields
   * @returns A list of formated seected fields
   */
  private getFormatedSelectedFields(
    queryFields: any[],
    selectedFields: (string | undefined)[]
  ): any[] {
    const rootFields = selectedFields.map((field) => field?.split('.')[0]);
    return queryFields
      .filter((queryField) => rootFields.includes(queryField.name))
      .map((queryField) => {
        const formatedFields = queryField.fields
          ? this.getFormatedSelectedFields(
              queryField.fields,
              selectedFields
                .filter((field) => field?.split('.')[0] === queryField.name)
                .map((field) => field?.split('.').slice(1).join('.'))
            )
          : null;
        return {
          ...queryField,
          ...(formatedFields ? { fields: formatedFields } : {}),
        };
      });
  }

  /**
   * Listen the window size and call the resizeTab function.
   *
   * @param event Event that implies a change in window size
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    this.resizeTab(event.target.innerWidth);
  }

  /**
   * Change the tab display depending on windows size.
   *
   * @param width The width of the window.
   */
  private resizeTab(width: any): void {
    const oldValue = this.largeDevice;
    this.largeDevice = width > 1024;
    if (this.largeDevice !== oldValue) {
      if (this.largeDevice) {
        this.elRef.nativeElement.style.setProperty('--tab-width', '240px');
      } else {
        this.elRef.nativeElement.style.setProperty('--tab-width', '80px');
      }
    }
  }
}
