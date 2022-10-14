import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { QueryBuilderService } from '../../../services/query-builder/query-builder.service';
import { createQueryForm } from '../../query-builder/query-builder-forms';
import { Apollo } from 'apollo-angular';
import { GetFormsQueryResponse, GET_FORMS } from './graphql/queries';
import { Form, status } from '../../../models/form.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { MAT_AUTOCOMPLETE_SCROLL_STRATEGY } from '@angular/material/autocomplete';
import { scrollFactory } from '../../../utils/scroll-factory';
import { Overlay } from '@angular/cdk/overlay';

/** Component for the map widget settings */
@Component({
  selector: 'safe-map-settings',
  templateUrl: './map-settings.component.html',
  styleUrls: ['./map-settings.component.scss'],
  providers: [
    {
      provide: MAT_AUTOCOMPLETE_SCROLL_STRATEGY,
      useFactory: scrollFactory,
      deps: [Overlay],
    },
  ],
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

  // === FORMS ===
  private availableForms = new BehaviorSubject<Form[]>([]);
  public availableForms$!: Observable<Form[]>;
  private content: Form[] = [];
  public sourceControl!: AbstractControl;
  public queryName = new BehaviorSubject<string>('');
  public queryName$!: Observable<string>; 
  public availableFields: any[] = [];

  public selectedFields: any[] = [];
  public loading = true;

  /**
   * Getter for the available scalar fields
   *
   * @returns the available scalar fields
   */
   get availableScalarFields(): any[] {
    return this.availableFields.filter(
      (x) => x.type.kind === 'SCALAR' || x.type.kind === 'OBJECT'
    );
  }

  /**
   * Constructor of the component
   *
   * @param formBuilder Create the formbuilder
   * @param queryBuilder The queryBuilder service
   */
  constructor(
    private formBuilder: FormBuilder,
    private queryBuilder: QueryBuilderService,
    private apollo: Apollo
  ) {}

  /** Build the settings form, using the widget saved parameters. */
  ngOnInit(): void {
    console.log('init map settings');
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

    queryForm.controls.name.valueChanges.subscribe((name: any) => {
      this.tileForm?.controls.latitude.setValue('');
      this.tileForm?.controls.longitude.setValue('');
      this.updateName(name);
    });
    queryForm.valueChanges.subscribe((res) => {
      this.selectedFields = this.getFields(queryForm.getRawValue().fields);
    });

    this.LoadForms(queryForm);

    const validSourceControl = this.tileForm.get('query.name');
    if (validSourceControl) {
      this.sourceControl = validSourceControl;
    }
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

  private LoadForms(queryForm: FormGroup) : void {
    console.log('load forms');
    this.availableForms$ = this.availableForms.asObservable();
    this.apollo.query<GetFormsQueryResponse>({
      query: GET_FORMS,
    })
    .subscribe((res) => {
        this.content = res.data.forms.edges.map((x) => x.node).filter((x) => x.core || x.status === status.active);
        this.availableForms.next(this.content);
        //this.buildSettings(queryForm);
        const matchForm = this.content.find((val: Form) => val.id === queryForm.value.name || val.name === queryForm.value.name);
        if (matchForm && matchForm.name) {
          console.log('match init');
          this.queryName.next(this.queryBuilder.getQueryNameFromResourceName(matchForm.name));
          queryForm.controls.name.setValue(matchForm.name);
        }
        this.queryName$ = this.queryName.asObservable();
        console.log('query name observer:', this.queryName.getValue());
        this.loading = false;
    });
    console.log('end load forms');
  }

  /**
   * Builds the form from the type of field / query we inject.
   */
   buildSettings(queryForm: FormGroup): void {
    console.log('build settings');
    if (queryForm.value.type) {
      console.log('tile form type');
      if (queryForm.get('filter')) {
        console.log('tile form filter');
        queryForm.setControl(
          'filter',
          this.createFilterGroup(queryForm.value.filter)
        );
      }
    } else {
      if (queryForm.value.name) {
        if (this.content && this.content.length > 0){
          const matchForm = this.content.find((val: Form) => val.id === queryForm.value.name || val.name === queryForm.value.name);
          if (matchForm && matchForm.name) {
            console.log('match form');
            this.queryName.next(this.queryBuilder.getQueryNameFromResourceName(matchForm.name));
          }
          this.availableFields = this.queryBuilder.getFields(
            this.queryName.getValue()
          );
          queryForm.setControl(
            'filter',
            this.createFilterGroup(queryForm.value.filter)
          );
        }
      }
    }
  }

  private createFilterGroup(filter: any): FormGroup {
    if (filter?.filters) {
      const filters = filter.filters.map((x: any) => this.createFilterGroup(x));
      return this.formBuilder.group({
        logic: filter.logic || 'and',
        filters: this.formBuilder.array(filters),
      });
    }
    if (filter?.field) {
      return this.formBuilder.group({
        field: filter.field,
        operator: filter.operator || 'eq',
        value: Array.isArray(filter.value) ? [filter.value] : filter.value,
      });
    }
    return this.formBuilder.group({
      logic: 'and',
      filters: this.formBuilder.array([]),
    });
  }

  private updateFields(name: any, queryForm: FormGroup): void {
    const matchForm = this.content.find((val: Form) => val.id === name || val.name === name);
    if (matchForm && matchForm.name) {
      console.log('match form');
      const newQueryName = this.queryBuilder.getQueryNameFromResourceName(matchForm.name);
      if (this.queryName.getValue() !== newQueryName){
        console.log('query name different');
        this.queryName.next(newQueryName);
        this.availableFields = this.queryBuilder.getFields(this.queryName.getValue());
        queryForm.setControl('filter', this.createFilterGroup(null));
        queryForm.setControl(
          'fields',
          this.formBuilder.array([], Validators.required)
        );
        queryForm.setControl(
          'sort',
          this.formBuilder.group({
            field: [''],
            order: ['asc'],
          })
        );
      }
    } else {
      console.log('match failed');
      this.queryName.next('');
      this.availableFields = [];
      queryForm.setControl('filter', this.createFilterGroup(null));
      queryForm.setControl('fields', this.formBuilder.array([]));
      queryForm.setControl(
        'sort',
        this.formBuilder.group({
          field: [''],
          order: ['asc'],
        })
      );
    }
  }


  private updateName(name: any): void {
    const matchForm = this.content.find((val: Form) => val.id === name || val.name === name);
    if (matchForm && matchForm.name) {
      console.log('match form');
      const newQueryName = this.queryBuilder.getQueryNameFromResourceName(matchForm.name);
      if (this.queryName.getValue() !== newQueryName){
        console.log('query name different:', this.queryName.getValue(), newQueryName);
        this.queryName.next(newQueryName);
      }
    } else {
      console.log('update name match failed:', name);
      this.queryName.next('');
    }
  }
}
