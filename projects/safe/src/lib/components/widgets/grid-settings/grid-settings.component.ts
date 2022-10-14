import { Apollo } from 'apollo-angular';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';
import { FormGroup, FormBuilder, FormArray, AbstractControl } from '@angular/forms';
import { QueryBuilderService } from '../../../services/query-builder/query-builder.service';
import {
  GetChannelsQueryResponse,
  GET_CHANNELS,
  GET_GRID_FORM_META,
  GetFormByIdQueryResponse,
  GET_GRID_RESOURCE_META,
  GetResourceByIdQueryResponse,
  GET_FORMS,
  GetFormsQueryResponse,
} from './graphql/queries';
import { Application } from '../../../models/application.model';
import { Channel } from '../../../models/channel.model';
import { SafeApplicationService } from '../../../services/application/application.service';
import { Form, status } from '../../../models/form.model';
import { Observable, BehaviorSubject } from 'rxjs';
import { Overlay } from '@angular/cdk/overlay';
import { MAT_AUTOCOMPLETE_SCROLL_STRATEGY } from '@angular/material/autocomplete';
import { scrollFactory } from '../../../utils/scroll-factory';
import { Resource } from '../../../models/resource.model';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { createGridWidgetFormGroup } from './grid-settings.forms';

/**
 * Modal content for the settings of the grid widgets.
 */
@Component({
  selector: 'safe-grid-settings',
  templateUrl: './grid-settings.component.html',
  styleUrls: ['./grid-settings.component.scss'],
  providers: [
    {
      provide: MAT_AUTOCOMPLETE_SCROLL_STRATEGY,
      useFactory: scrollFactory,
      deps: [Overlay],
    },
  ],
})
export class SafeGridSettingsComponent implements OnInit, AfterViewInit {
  // === REACTIVE FORM ===
  public formGroup!: FormGroup;

  // === WIDGET ===
  @Input() tile: any;

  // === EMIT THE CHANGES APPLIED ===
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() change: EventEmitter<any> = new EventEmitter();

  // === NOTIFICATIONS ===
  public channels: Channel[] = [];

  // === FLOATING BUTTON ===
  public fields: any[] = [];
  public queryName = '';
  public relatedForms: Form[] = [];

  // === DATASET AND TEMPLATES ===
  public templates: Form[] = [];
  public availableQueries?: Observable<any[]>;
  private allQueries: any[] = [];
  public filteredQueries: any[] = [];
  public form: Form | null = null;
  public resource: Resource | null = null;

  // === FORMS ===
  private availableForms = new BehaviorSubject<Form[]>([]);
  public availableForms$!: Observable<Form[]>;
  private content: Form[] = [];
  public sourceControl!: AbstractControl;

  /** Stores the selected tab */
  public selectedTab = 0;

  /**
   * Constructor of the grid settings component
   *
   * @param apollo The apollo client
   * @param applicationService The application service
   * @param queryBuilder The query builder service
   */
  constructor(
    private apollo: Apollo,
    private applicationService: SafeApplicationService,
    private queryBuilder: QueryBuilderService
  ) {}

  /** Build the settings form, using the widget saved parameters. */
  ngOnInit(): void {
    const tileSettings = this.tile.settings;
    this.formGroup = createGridWidgetFormGroup(this.tile.id, tileSettings);
    this.availableQueries = this.queryBuilder.availableQueries$;
    this.availableQueries.subscribe((res) => {
      if (res && res.length > 0) {
        this.allQueries = res.map((x) => x.name);
        this.filteredQueries = this.filterQueries(
          this.formGroup?.value.query.name
        );
      }
    });
    this.formGroup?.get('query.name')?.valueChanges.subscribe((res) => {
      this.filteredQueries = this.filterQueries(res);
    });

    // NEW
    this.LoadForms();
    const validSourceControl = this.formGroup.get('query.name');
    if (validSourceControl) {
      this.sourceControl = validSourceControl;
    }
  }

  ngAfterViewInit(): void {
    if (this.formGroup) {
      this.formGroup.valueChanges.subscribe(() => {
        this.change.emit(this.formGroup);
      });

      this.applicationService.application$.subscribe(
        (application: Application | null) => {
          if (application) {
            this.apollo
              .watchQuery<GetChannelsQueryResponse>({
                query: GET_CHANNELS,
                variables: {
                  application: application.id,
                },
              })
              .valueChanges.subscribe((res) => {
                this.channels = res.data.channels;
              });
          } else {
            this.apollo
              .watchQuery<GetChannelsQueryResponse>({
                query: GET_CHANNELS,
              })
              .valueChanges.subscribe((res) => {
                this.channels = res.data.channels;
              });
          }
        }
      );
    }
  }

  /**
   * Gets query metadata for grid settings, from the query name
   */
  private getQueryMetaData(): void {
    this.fields = this.queryBuilder.getFields(this.queryName);
    const query = this.queryBuilder.sourceQuery(this.queryName);
    if (query) {
      const layoutIDs: string[] | undefined =
        this.formGroup?.get('layouts')?.value;
      query.subscribe((res1: { data: any }) => {
        // eslint-disable-next-line no-underscore-dangle
        const source = res1.data[`_${this.queryName}Meta`]._source;
        this.formGroup?.get('resource')?.setValue(source);
        if (source) {
          this.apollo
            .query<GetResourceByIdQueryResponse>({
              query: GET_GRID_RESOURCE_META,
              variables: {
                resource: source,
                layoutIds: layoutIDs,
                first: layoutIDs?.length || 10,
              },
            })
            .subscribe((res2) => {
              if (res2.errors) {
                this.apollo
                  .query<GetFormByIdQueryResponse>({
                    query: GET_GRID_FORM_META,
                    variables: {
                      id: source,
                      layoutIds: layoutIDs,
                      first: layoutIDs?.length || 10,
                    },
                  })
                  .subscribe((res3) => {
                    if (res3.errors) {
                      this.relatedForms = [];
                      this.templates = [];
                      this.form = null;
                      this.resource = null;
                    } else {
                      this.form = res3.data.form;
                      this.resource = null;
                      this.templates = [res3.data.form] || [];
                      this.formGroup
                        ?.get('query.template')
                        ?.setValue(res3.data.form.id);
                      this.formGroup?.get('query.template')?.disable();
                    }
                  });
              } else {
                this.resource = res2.data.resource;
                this.form = null;
                this.relatedForms = res2.data.resource.relatedForms || [];
                this.templates = res2.data.resource.forms || [];
              }
            });
        }
      });
    } else {
      this.relatedForms = [];
      this.templates = [];
      this.form = null;
      this.resource = null;
    }
  }

  /**
   * Filters the queries using text value.
   *
   * @param value search value
   * @returns filtered list of queries.
   */
  private filterQueries(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.allQueries.filter((x) => x.toLowerCase().includes(filterValue));
  }

  /**
   *  Handles the a tab change event
   *
   * @param event Event triggered on tab switch
   */
  handleTabChange(event: MatTabChangeEvent): void {
    this.selectedTab = event.index;
  }

  private LoadForms(): void {
    this.availableForms$ = this.availableForms.asObservable();
    this.apollo.query<GetFormsQueryResponse>({
      query: GET_FORMS,
    })
    .subscribe((res) => {
        this.availableForms.next(res.data.forms.edges.map((x) => x.node).filter((x) => x.core || x.status === status.active));
        this.content = res.data.forms.edges.map((x) => x.node);

        // to display the resource name at the beginning and not the form's id
        const queryValue = this.formGroup.get('query')?.value.name;
        const matchForm = this.content.find((val: Form) => val.id === queryValue || val.name === queryValue);
        if (matchForm && matchForm?.name) {
          this.formGroup.get('query.name')?.setValue(matchForm.name);
          this.queryName = this.queryBuilder.getQueryNameFromResourceName(matchForm.name);
          this.getQueryMetaData();
        }
        this.formGroup.get('query.name')?.valueChanges.subscribe((name) => {
          if (name) {
            // Check if the query changed to clean modifications and fields for email in floating button
            console.log('name update:', name);
            if (name !== this.queryName) {
              this.queryName = name;
              console.log('name !== query name');
              const matchForm = this.content.find((val: Form) => val.id === name || val.name === name);
              if (matchForm && matchForm?.name) {
                console.log('matched form');
                this.queryName = this.queryBuilder.getQueryNameFromResourceName(matchForm.name);
              }
              this.formGroup?.get('layouts')?.setValue([]);
              this.formGroup?.get('query.template')?.setValue(null);
              this.formGroup?.get('query.template')?.enable();
              const floatingButtons = this.formGroup?.get(
                'floatingButtons'
              ) as FormArray;
              for (const floatingButton of floatingButtons.controls) {
                const modifications = floatingButton.get(
                  'modifications'
                ) as FormArray;
                modifications.clear();
                this.formGroup
                  ?.get('floatingButton.modifySelectedRows')
                  ?.setValue(false);
                const bodyFields = floatingButton.get('bodyFields') as FormArray;
                bodyFields.clear();
              }
            }
            this.getQueryMetaData();
          } else {
            this.fields = [];
          }
        });
    });      
  }
}
