import { Apollo } from 'apollo-angular';
import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  AfterViewInit,
} from '@angular/core';
import {
  UntypedFormGroup,
  UntypedFormArray,
  Validators,
  FormBuilder,
  FormArray,
} from '@angular/forms';
import { QueryBuilderService } from '../../../services/query-builder/query-builder.service';
import { GET_CHANNELS, GET_GRID_RESOURCE_META } from './graphql/queries';
import { Application } from '../../../models/application.model';
import { Channel, ChannelsQueryResponse } from '../../../models/channel.model';
import { ApplicationService } from '../../../services/application/application.service';
import { Form } from '../../../models/form.model';
import {
  Resource,
  ResourceQueryResponse,
} from '../../../models/resource.model';
import { createGridWidgetFormGroup } from './grid-settings.forms';
import { DistributionList } from '../../../models/distribution-list.model';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';
import { extendWidgetForm } from '../common/display-settings/extendWidgetForm';
import { AggregationService } from '../../../services/aggregation/aggregation.service';

/**
 * Modal content for the settings of the grid widgets.
 */
@Component({
  selector: 'shared-grid-settings',
  templateUrl: './grid-settings.component.html',
  styleUrls: ['./grid-settings.component.scss'],
})
export class GridSettingsComponent
  extends UnsubscribeComponent
  implements OnInit, AfterViewInit
{
  // === REACTIVE FORM ===
  public formGroup!: UntypedFormGroup;
  public filtersFormArray: any = null;

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

  /** @returns application templates */
  get appTemplates(): any[] {
    return this.applicationService.templates || [];
  }

  /** @returns application distribution lists */
  get distributionLists(): DistributionList[] {
    return this.applicationService.distributionLists || [];
  }

  /**
   * Constructor of the grid settings component
   *
   * @param apollo The apollo client
   * @param applicationService The application service
   * @param queryBuilder The query builder service
   * @param fb FormBuilder instance
   * @param aggregationService Shared aggregation service
   */
  constructor(
    private apollo: Apollo,
    private applicationService: ApplicationService,
    private queryBuilder: QueryBuilderService,
    private fb: FormBuilder,
    private aggregationService: AggregationService
  ) {
    super();
  }

  /** Build the settings form, using the widget saved parameters. */
  ngOnInit(): void {
    const tileSettings = this.tile.settings;
    this.formGroup = extendWidgetForm(
      createGridWidgetFormGroup(this.tile.id, tileSettings),
      tileSettings?.widgetDisplay
    );

    this.change.emit(this.formGroup);

    // this.formGroup?.get('query.name')?.valueChanges.subscribe((res) => {
    //   this.filteredQueries = this.filterQueries(res);
    // });

    // this.queryName = this.formGroup.get('query')?.value.name;
    this.getQueryMetaData();

    // Subscribe to form resource changes
    this.formGroup
      .get('resource')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
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
            ) as UntypedFormArray;
            for (const floatingButton of floatingButtons.controls) {
              const modifications = floatingButton.get(
                'modifications'
              ) as UntypedFormArray;
              modifications.clear();
              this.formGroup
                ?.get('floatingButton.modifySelectedRows')
                ?.setValue(false);
              const bodyFields = floatingButton.get(
                'bodyFields'
              ) as UntypedFormArray;
              bodyFields.clear();
            }
          }
          this.getQueryMetaData();
        } else {
          this.fields = [];
        }

        // clear sort fields array
        const sortFields = this.formGroup?.get('sortFields') as FormArray;
        sortFields.clear();
      });

    // Subscribe to form aggregations changes
    this.formGroup
      .get('aggregations')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.updateValueAndValidityByType(value, 'aggregations');
        if (value.length > 0) {
          this.onAggregationChange(value[0]);
        }
      });
    // If some aggregations are selected, remove validators on layouts field
    if (this.formGroup.get('aggregations')?.value.length > 0) {
      this.formGroup.controls.layouts.clearValidators();
    }

    // Subscribe to form layouts changes
    this.formGroup
      .get('layouts')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.updateValueAndValidityByType(value, 'layouts');
      });
    // If some layouts are selected, remove validators on aggregations field
    if (this.formGroup.get('layouts')?.value.length > 0) {
      this.formGroup.controls.aggregations.clearValidators();
    }

    this.initSortFields();
  }

  /**
   * Adds sortFields to the formGroup
   */
  initSortFields(): void {
    this.tile.settings.sortFields?.forEach((item: any) => {
      const row = this.fb.group({
        field: [item.field, Validators.required],
        order: [item.order, Validators.required],
        label: [item.label, Validators.required],
      });
      (this.formGroup?.get('sortFields') as any).push(row);
    });
  }

  /**
   * Update form group related to layouts and aggregations values and validity
   *
   * @param value of the given form control
   * @param type form control key regarding to the type: layouts | aggregations
   */
  private updateValueAndValidityByType(
    value: any,
    type: 'aggregations' | 'layouts'
  ) {
    const otherType = type === 'aggregations' ? 'layouts' : 'aggregations';
    if (value) {
      // Some type are selected
      if (value.length > 0) {
        // Remove validators on other type fields fields
        this.formGroup.controls[otherType].clearValidators();
      } else {
        // No type selected
        if (this.formGroup.controls[otherType].value.length > 0) {
          // Remove validators on type field if other type are selected
          this.formGroup.controls[type].clearValidators();
        } else {
          // Else, reset all validators
          this.formGroup.controls[type].setValidators([Validators.required]);
          this.formGroup.controls[otherType].setValidators([
            Validators.required,
          ]);
        }
      }
    }
    // Update fields without sending update events to prevent infinite loops
    this.formGroup.controls[type].updateValueAndValidity({
      emitEvent: false,
    });
    this.formGroup.controls[otherType].updateValueAndValidity({
      emitEvent: false,
    });
  }

  ngAfterViewInit(): void {
    if (this.formGroup) {
      this.formGroup.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.change.emit(this.formGroup);
        });

      this.applicationService.application$
        .pipe(takeUntil(this.destroy$))
        .subscribe((application: Application | null) => {
          if (application) {
            this.apollo
              .query<ChannelsQueryResponse>({
                query: GET_CHANNELS,
                variables: {
                  application: application.id,
                },
              })
              .pipe(takeUntil(this.destroy$))
              .subscribe(({ data }) => {
                this.channels = data.channels;
              });
          } else {
            this.apollo
              .query<ChannelsQueryResponse>({
                query: GET_CHANNELS,
              })
              .pipe(takeUntil(this.destroy$))
              .subscribe(({ data }) => {
                this.channels = data.channels;
              });
          }
        });
    }
  }

  /**
   * Gets query metadata for grid settings, from the query name
   */
  private getQueryMetaData(): void {
    if (this.formGroup.get('resource')?.value) {
      const layoutIds: string[] | undefined =
        this.formGroup?.get('layouts')?.value;
      const aggregationIds: string[] | undefined =
        this.formGroup?.get('aggregations')?.value;
      this.apollo
        .query<ResourceQueryResponse>({
          query: GET_GRID_RESOURCE_META,
          variables: {
            resource: this.formGroup.get('resource')?.value,
            layoutIds,
            firstLayouts: layoutIds?.length || 10,
            aggregationIds,
            firstAggregations: aggregationIds?.length || 10,
          },
        })
        .subscribe(({ data }) => {
          if (data) {
            this.resource = data.resource;
            this.relatedForms = data.resource.relatedForms || [];
            this.templates = data.resource.forms || [];
            if (this.formGroup.get('aggregations')?.value.length > 0) {
              this.onAggregationChange(
                this.formGroup.get('aggregations')?.value[0]
              );
            } else {
              this.fields = this.queryBuilder.getFields(
                this.resource.queryName as string
              );
            }
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
   *  Handles the a tab change event
   *
   * @param event Event triggered on tab switch
   */
  handleTabChange(event: number): void {
    this.selectedTab = event;
  }

  /**
   * Handle aggregation change
   * Update available fields
   *
   * @param aggregationId new aggregation id
   */
  private onAggregationChange(aggregationId: string): void {
    if (this.resource?.id && aggregationId) {
      this.aggregationService
        .aggregationDataQuery(this.resource.id, aggregationId || '')
        .subscribe(({ data }) => {
          if (data.recordsAggregation) {
            this.fields = data.recordsAggregation.items[0]
              ? Object.keys(data.recordsAggregation.items[0]).map((f) => ({
                  name: f,
                  editor: 'text',
                }))
              : [];
          }
        });
    }
  }
}
