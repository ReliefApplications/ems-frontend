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
import { AggregationService } from '../../../services/aggregation/aggregation.service';
import { WidgetSettings } from '../../../models/dashboard.model';

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
  implements
    OnInit,
    AfterViewInit,
    WidgetSettings<typeof createGridWidgetFormGroup>
{
  /** Widget */
  @Input() widget: any;
  /** Event emitter for change */
  @Output() formChange: EventEmitter<
    ReturnType<typeof createGridWidgetFormGroup>
  > = new EventEmitter();
  /** Form group */
  public widgetFormGroup!: ReturnType<typeof createGridWidgetFormGroup>;
  /** Form array for filters */
  public filtersFormArray: any = null;
  /** List of channels */
  public channels?: Channel[];
  /** List of fields */
  public fields: any[] = [];
  /** List of related forms */
  public relatedForms: Form[] = [];
  /** List of public templates */
  public templates: Form[] = [];
  /** Resource */
  public resource: Resource | null = null;
  /** Loading status */
  public loading = false;
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
   * Modal content for the settings of the grid widgets.
   *
   * @param apollo Apollo client
   * @param applicationService Shared application service
   * @param queryBuilder Shared query builder service
   * @param fb Angular form builder
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

  ngOnInit(): void {
    if (!this.widgetFormGroup) {
      this.buildSettingsForm();
    }

    this.getQueryMetaData();

    // Subscribe to form resource changes
    this.widgetFormGroup
      .get('resource')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          // Check if the query changed to clean modifications and fields for email in floating button
          if (value !== this.resource?.id) {
            // this.queryName = name;
            this.widgetFormGroup?.get('layouts')?.setValue([]);
            this.widgetFormGroup?.get('aggregations')?.setValue([]);
            this.widgetFormGroup?.get('template')?.setValue(null);
            this.widgetFormGroup?.get('template')?.enable();
            const floatingButtons = this.widgetFormGroup?.get(
              'floatingButtons'
            ) as UntypedFormArray;
            let floatingButtonIndex = 0;
            for (const floatingButton of floatingButtons.controls) {
              const modifications = floatingButton.get(
                'modifications'
              ) as UntypedFormArray;
              modifications.clear();
              (
                this.widgetFormGroup?.get('floatingButtons') as UntypedFormArray
              ).controls
                .at(floatingButtonIndex)
                ?.get('modifySelectedRows')
                ?.setValue(false);
              const bodyFields = floatingButton.get(
                'bodyFields'
              ) as UntypedFormArray;
              bodyFields.clear();
              floatingButtonIndex++;
            }
          }
          this.getQueryMetaData();
        } else {
          this.widgetFormGroup?.get('layouts')?.setValue([]);
          this.widgetFormGroup?.get('aggregations')?.setValue([]);
          this.widgetFormGroup?.get('template')?.setValue(null);
          this.fields = [];
          this.resource = null;
        }

        // clear sort fields array
        const sortFields = this.widgetFormGroup?.get('sortFields') as FormArray;
        sortFields.clear();
      });

    // Subscribe to form aggregations changes
    this.widgetFormGroup
      .get('aggregations')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.updateValueAndValidityByType(value, 'aggregations');
        if (value.length > 0) {
          this.onAggregationChange(value[0]);
        }
      });
    // If some aggregations are selected, remove validators on layouts field
    if (this.widgetFormGroup.get('aggregations')?.value.length > 0) {
      this.widgetFormGroup.controls.layouts.clearValidators();
    }

    // Subscribe to form layouts changes
    this.widgetFormGroup
      .get('layouts')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.updateValueAndValidityByType(value, 'layouts');
      });
    // If some layouts are selected, remove validators on aggregations field
    if (this.widgetFormGroup.get('layouts')?.value.length > 0) {
      this.widgetFormGroup.controls.aggregations.clearValidators();
    }

    this.initSortFields();
  }

  /**
   * Adds sortFields to the formGroup
   */
  initSortFields(): void {
    this.widget.settings.sortFields?.forEach((item: any) => {
      const row = this.fb.group({
        field: [item.field, Validators.required],
        order: [item.order, Validators.required],
        label: [item.label, Validators.required],
      });
      (this.widgetFormGroup?.get('sortFields') as any).push(row);
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
        this.widgetFormGroup.controls[otherType].clearValidators();
      } else {
        // No type selected
        if (this.widgetFormGroup.controls[otherType].value.length > 0) {
          // Remove validators on type field if other type are selected
          this.widgetFormGroup.controls[type].clearValidators();
        } else {
          // Else, reset all validators
          this.widgetFormGroup.controls[type].setValidators([
            Validators.required,
          ]);
          this.widgetFormGroup.controls[otherType].setValidators([
            Validators.required,
          ]);
        }
      }
    }
    // Update fields without sending update events to prevent infinite loops
    this.widgetFormGroup.controls[type].updateValueAndValidity({
      emitEvent: false,
    });
    this.widgetFormGroup.controls[otherType].updateValueAndValidity({
      emitEvent: false,
    });
  }

  ngAfterViewInit(): void {
    if (this.widgetFormGroup) {
      this.widgetFormGroup.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          this.formChange.emit(this.widgetFormGroup);
        });
    }
  }

  /**
   * Load GET_CHANNELS query when data is necessary.
   */
  public getChannels(): void {
    if (this.widgetFormGroup) {
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
    if (this.widgetFormGroup.get('resource')?.value) {
      this.loading = true;
      const layoutIds: string[] | undefined =
        this.widgetFormGroup?.get('layouts')?.value;
      const aggregationIds: string[] | undefined =
        this.widgetFormGroup?.get('aggregations')?.value;
      this.apollo
        .query<ResourceQueryResponse>({
          query: GET_GRID_RESOURCE_META,
          variables: {
            resource: this.widgetFormGroup.get('resource')?.value,
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
            if (this.widgetFormGroup.get('aggregations')?.value.length > 0) {
              this.onAggregationChange(
                this.widgetFormGroup.get('aggregations')?.value[0]
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
          this.loading = false;
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
        .aggregationDataQuery({
          resource: this.resource.id,
          aggregation: aggregationId || '',
        })
        .subscribe(({ data }: any) => {
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

  /**
   * Build the settings form, using the widget saved parameters
   */
  public buildSettingsForm() {
    this.widgetFormGroup = createGridWidgetFormGroup(
      this.widget.id,
      this.widget.settings
    );
  }
}
