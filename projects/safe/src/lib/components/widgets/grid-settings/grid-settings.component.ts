import { Apollo } from 'apollo-angular';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';
import { FormGroup, FormArray, Validators } from '@angular/forms';
import { QueryBuilderService } from '../../../services/query-builder/query-builder.service';
import {
  GetChannelsQueryResponse,
  GET_CHANNELS,
  GET_GRID_RESOURCE_META,
  GetResourceByIdQueryResponse,
} from './graphql/queries';
import { Application } from '../../../models/application.model';
import { Channel } from '../../../models/channel.model';
import { SafeApplicationService } from '../../../services/application/application.service';
import { Form } from '../../../models/form.model';
import { Observable } from 'rxjs';
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
  public relatedForms: Form[] = [];

  // === DATASET AND TEMPLATES ===
  public templates: Form[] = [];
  private allQueries: any[] = [];
  public filteredQueries: any[] = [];
  public resource: Resource | null = null;

  /** Stores the selected tab */
  public selectedTab = 0;
  /**
   * Getter for the app templates
   *
   * @returns list of templates
   */
  get appTemplates(): any[] {
    return this.applicationService.templates || [];
  }

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
    this.change.emit(this.formGroup);
    // this.formGroup?.get('query.name')?.valueChanges.subscribe((res) => {
    //   this.filteredQueries = this.filterQueries(res);
    // });

    // this.queryName = this.formGroup.get('query')?.value.name;
    this.getQueryMetaData();

    this.formGroup.get('resource')?.valueChanges.subscribe((value) => {
      if (value) {
        // Check if the query changed to clean modifications and fields for email in floating button
        if (value !== this.resource?.id) {
          // this.queryName = name;
          this.formGroup?.get('layouts')?.setValue([]);
          this.formGroup?.get('aggregations')?.setValue([]);
          this.formGroup?.get('template')?.setValue(null);
          this.formGroup?.get('template')?.enable();
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

    this.formGroup.get('aggregations')?.valueChanges.subscribe((value) => {
      if (value) {
        if (value.length > 0) {
          this.formGroup.controls.layouts.clearValidators();
        } else {
          if (this.formGroup.controls.layouts.value.length > 0) {
            this.formGroup.controls.aggregations.clearValidators();
          } else {
            this.formGroup.controls.aggregations.setValidators([
              Validators.required,
            ]);
            this.formGroup.controls.layouts.setValidators([
              Validators.required,
            ]);
          }
        }
      }
      this.formGroup.controls.aggregations.updateValueAndValidity({
        emitEvent: false,
      });
      this.formGroup.controls.layouts.updateValueAndValidity({
        emitEvent: false,
      });
    });

    this.formGroup.get('layouts')?.valueChanges.subscribe((value) => {
      if (value) {
        if (value.length > 0) {
          this.formGroup.controls.aggregations.clearValidators();
        } else {
          if (this.formGroup.controls.aggregations.value.length > 0) {
            this.formGroup.controls.layouts.clearValidators();
          } else {
            this.formGroup.controls.layouts.setValidators([
              Validators.required,
            ]);
            this.formGroup.controls.aggregations.setValidators([
              Validators.required,
            ]);
          }
        }
      }
      this.formGroup.controls.aggregations.updateValueAndValidity({
        emitEvent: false,
      });
      this.formGroup.controls.layouts.updateValueAndValidity({
        emitEvent: false,
      });
    });
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
    if (this.formGroup.get('resource')?.value) {
      const layoutIDs: string[] | undefined =
        this.formGroup?.get('layouts')?.value;
      this.apollo
        .query<GetResourceByIdQueryResponse>({
          query: GET_GRID_RESOURCE_META,
          variables: {
            resource: this.formGroup.get('resource')?.value,
            layoutIds: layoutIDs,
            first: layoutIDs?.length || 10,
          },
        })
        .subscribe((res) => {
          if (res.data) {
            this.resource = res.data.resource;
            this.relatedForms = res.data.resource.relatedForms || [];
            this.templates = res.data.resource.forms || [];
            this.fields = this.queryBuilder.getFields(
              this.resource.queryName as string
            );
          } else {
            this.relatedForms = [];
            this.templates = [];
            this.resource = null;
            this.fields = [];
          }
        });
    } else {
      this.relatedForms = [];
      this.templates = [];
      this.resource = null;
      this.fields = [];
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
}
