import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import {
  Validators,
  FormGroup,
  FormControl,
  FormArray,
  FormBuilder,
} from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { get } from 'lodash';
import { Aggregation } from '../../../models/aggregation.model';
import { Layout } from '../../../models/layout.model';
import {
  Resource,
  ResourceQueryResponse,
} from '../../../models/resource.model';
import { AggregationService } from '../../../services/aggregation/aggregation.service';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { extendWidgetForm } from '../common/display-settings/extendWidgetForm';
import { GET_REFERENCE_DATA, GET_RESOURCE } from './graphql/queries';
import { takeUntil } from 'rxjs';
import {
  ReferenceData,
  ReferenceDataQueryResponse,
} from '../../../models/reference-data.model';

// todo: put in common
/** Default context filter value. */
const DEFAULT_CONTEXT_FILTER = `{
  "logic": "and",
  "filters": []
}`;

/**
 * Create a card form
 *
 * @param value card value, optional
 * @returns card as form group
 */
const createCardForm = (value?: any) => {
  return new FormGroup({
    title: new FormControl<string>(get(value, 'title', 'New Card')),
    html: new FormControl<string>(get(value, 'html', null)),
    showDataSourceLink: new FormControl<boolean>(
      get(value, 'showDataSourceLink', false)
    ),
    useStyles: new FormControl<boolean>(get(value, 'useStyles', true)),
    wholeCardStyles: new FormControl<boolean>(
      get(value, 'wholeCardStyles', false)
    ),
  });
};

/**
 * Create a summary card form from definition
 *
 * @param def Widget definition
 * @returns Summary card widget form
 */
const createSummaryCardForm = (def: any) => {
  const settings = get(def, 'settings', {});

  const form = new FormGroup({
    id: new FormControl<number>(def.id),
    title: new FormControl<string>(get(settings, 'title', '')),
    card: createCardForm(get(settings, 'card', null)),
    ///////////////////////////////
    // This properties goes in the general settings, but for currently saved summary card settings we would add this get checks
    resource: new FormControl<string>(
      get(settings, 'resource', null) ?? get(settings, 'card', null)?.resource
    ),
    referenceData: new FormControl<string>(
      get(settings, 'referenceData', null) ??
        get(settings, 'card', null)?.referenceData
    ),
    aggregation: new FormControl<string>(
      get(settings, 'aggregation', null) ??
        get(settings, 'card', null)?.aggregation
    ),
    layout: new FormControl<string>(
      get(settings, 'layout', null) ?? get(settings, 'card', null)?.layout
    ),
    // Once they load and saved with this new config, this properties would be placed in the settings property root, as it is
    ///////////////////////////////
    sortFields: new FormArray([]),
    contextFilters: new FormControl(
      get(settings, 'contextFilters', DEFAULT_CONTEXT_FILTER)
    ),
    at: new FormControl(get(settings, 'at', '')),
  });

  const isUsingAggregation = !!get(settings, 'aggregation', null);
  const searchable = isUsingAggregation
    ? false
    : get<boolean>(settings, 'widgetDisplay.searchable', false);

  const extendedForm = extendWidgetForm(form, settings?.widgetDisplay, {
    searchable: new FormControl(searchable),
    usePagination: new FormControl(
      get<boolean>(settings, 'widgetDisplay.usePagination', false)
    ),
  });

  // disable searchable if aggregation is selected
  if (isUsingAggregation)
    extendedForm.get('widgetDisplay.searchable')?.disable();

  return extendedForm;
};
export type SummaryCardFormT = ReturnType<typeof createSummaryCardForm>;

/**
 * Summary Card Settings component.
 */
@Component({
  selector: 'shared-summary-card-settings',
  templateUrl: './summary-card-settings.component.html',
  styleUrls: ['./summary-card-settings.component.scss'],
})
export class SummaryCardSettingsComponent
  extends UnsubscribeComponent
  implements OnInit, AfterViewInit
{
  /** Widget */
  @Input() tile: any;
  /** Emit changes applied to the settings */
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() change: EventEmitter<any> = new EventEmitter();
  /** Form */
  public tileForm: SummaryCardFormT | undefined;
  /** Current resource */
  public selectedResource: Resource | null = null;
  /** Current reference data */
  public selectedReferenceData: ReferenceData | null = null;
  /** Current layout */
  public selectedLayout: Layout | null = null;
  /** Current aggregation */
  public selectedAggregation: Aggregation | null = null;
  public customAggregation: any;

  public fields: any[] = [];
  public activeTabIndex: number | undefined;

  /**
   * Summary Card Settings component.
   *
   * @param apollo Apollo service
   * @param aggregationService Shared aggregation service
   * @param fb FormBuilder instance
   */
  constructor(
    private apollo: Apollo,
    private aggregationService: AggregationService,
    private fb: FormBuilder
  ) {
    super();
  }

  /**
   * Build the settings form, using the widget saved parameters.
   */
  ngOnInit(): void {
    this.tileForm = createSummaryCardForm(this.tile);
    this.change.emit(this.tileForm);

    const resourceID = this.tileForm?.get('resource')?.value;
    if (resourceID) {
      this.getResource(resourceID);
    }
    const referenceDataID = this.tileForm?.get('referenceData')?.value;
    if (referenceDataID) {
      this.getReferenceData(referenceDataID);
    }
    // Subscribe to aggregation changes
    this.tileForm
      .get('aggregation')
      ?.valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((aggregationID) => {
        // disable searchable if aggregation is selected
        if (aggregationID) {
          const searchableControl = this.tileForm?.get(
            'widgetDisplay.searchable'
          );
          searchableControl?.setValue(false);
          searchableControl?.disable();
        } else this.tileForm?.get('widgetDisplay.searchable')?.enable();
      });
    this.tileForm?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.change.emit(this.tileForm);
    });

    this.initSortFields();
  }

  /**
   * Adds sortFields to the tileForm
   */
  initSortFields(): void {
    this.tile.settings.sortFields?.forEach((item: any) => {
      const row = this.fb.group({
        field: [item.field, Validators.required],
        order: [item.order, Validators.required],
        label: [item.label, Validators.required],
      });
      (this.tileForm?.get('sortFields') as any).push(row);
    });
  }

  /** @returns a FormControl for the searchable field */
  get searchableControl(): FormControl {
    return this.tileForm?.get('widgetDisplay.searchable') as any;
  }

  /** @returns a FormControl for the usePagination field */
  get usePaginationControl(): FormControl {
    return this.tileForm?.get('widgetDisplay.usePagination') as any;
  }

  /**
   * Detect the form changes to emit the new configuration.
   */
  ngAfterViewInit(): void {
    this.tileForm?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.change.emit(this.tileForm);
    });
  }

  /**
   * Sets an internal variable with the current tab.
   *
   * @param e Change tab event.
   */
  handleTabChange(e: number) {
    this.activeTabIndex = e;
  }

  /**
   * Get resource by id, doing graphQL query
   *
   * @param id resource id
   */
  private getResource(id: string): void {
    const form = this.tileForm;
    if (!form) {
      return;
    }
    const layoutID = form.get('layout')?.value;
    const aggregationID = form.get('aggregation')?.value;
    this.fields = [];
    this.apollo
      .query<ResourceQueryResponse>({
        query: GET_RESOURCE,
        variables: {
          id,
          layout: layoutID ? [layoutID] : undefined,
          aggregation: aggregationID ? [aggregationID] : undefined,
        },
      })
      .subscribe((res) => {
        if (res.errors) {
          form.get('resource')?.patchValue(null);
          form.get('layout')?.patchValue(null);
          form.get('aggregation')?.patchValue(null);
          this.selectedResource = null;
          this.selectedReferenceData = null;
          this.selectedLayout = null;
          this.selectedAggregation = null;
        } else {
          this.selectedResource = res.data.resource;
          if (layoutID) {
            this.selectedLayout =
              res.data?.resource.layouts?.edges[0]?.node || null;
            this.fields = [];
            get(res, 'data.resource.metadata', []).map((metaField: any) => {
              get(this.selectedLayout, 'query.fields', []).map((field: any) => {
                if (field.name === metaField.name) {
                  const type = metaField.type;
                  this.fields.push({ ...field, type });
                }
              });
            });
          }
          if (aggregationID) {
            this.selectedAggregation =
              res.data?.resource.aggregations?.edges[0]?.node || null;
            this.getCustomAggregation();
          }
        }
      });
  }

  /**
   * Get reference data by id, doing graphQL query
   *
   * @param id reference data id
   */
  private getReferenceData(id: string): void {
    const form = this.tileForm;
    if (!form) {
      return;
    }
    const aggregationID = form.get('aggregation')?.value;
    this.fields = [];
    this.apollo
      .query<ReferenceDataQueryResponse>({
        query: GET_REFERENCE_DATA,
        variables: {
          id,
          aggregation: aggregationID ? [aggregationID] : undefined,
        },
      })
      .subscribe((res) => {
        if (res.errors) {
          form.get('referenceData')?.patchValue(null);
          form.get('layout')?.patchValue(null);
          form.get('aggregation')?.patchValue(null);
          this.selectedReferenceData = null;
          this.selectedResource = null;
          this.selectedLayout = null;
          this.selectedAggregation = null;
        } else {
          this.selectedReferenceData = res.data.referenceData;

          if (aggregationID) {
            this.selectedAggregation =
              res.data?.referenceData.aggregations?.edges[0]?.node || null;
            this.getCustomAggregation();
          }
        }
      });
  }

  /**
   * Gets the custom aggregation
   * for the selected (resource or reference data) and aggregation.
   */
  private getCustomAggregation(): void {
    if (
      !this.selectedAggregation ||
      (!this.selectedResource?.id && !this.selectedReferenceData?.id)
    ) {
      return;
    }
    const id =
      this.selectedResource?.id ?? this.selectedReferenceData?.id ?? '';
    const type = this.selectedResource?.id ? 'resource' : 'referenceData';
    this.aggregationService
      .aggregationDataQuery(id, type, this.selectedAggregation.id || '')
      ?.subscribe((res) => {
        const aggregations =
          res.data?.recordsAggregation ?? res.data?.referenceDataAggregation;
        if (aggregations) {
          this.customAggregation = aggregations;
          // @TODO: Figure out fields' types from aggregation
          this.fields = this.customAggregation.items[0]
            ? Object.keys(this.customAggregation.items[0]).map((f) => ({
                name: f,
                editor: 'text',
              }))
            : [];
        }
      });
  }

  /**
   * Updates modified resource
   *
   * @param resource the modified resource
   */
  handleResourceChange(resource: Resource | null) {
    // clear sort fields array
    const sortFields = this.tileForm?.get('sortFields') as FormArray;
    sortFields.clear();

    this.selectedResource = resource;
    this.fields = [];

    // clear layout and record
    this.selectedLayout = null;
    this.selectedAggregation = null;
    this.customAggregation = null;
  }

  /**
   * Updates modified reference data
   *
   * @param referenceData the modified reference data
   */
  handleReferenceDataChange(referenceData: ReferenceData | null) {
    this.selectedReferenceData = referenceData;
    this.fields = [];

    // clear layout and record
    this.selectedLayout = null;
    this.selectedAggregation = null;
    this.customAggregation = null;
  }

  /**
   * Updates modified layout
   *
   * @param layout the modified layout
   */
  handleLayoutChange(layout: Layout | null) {
    this.selectedLayout = layout;

    // extract data keys from metadata
    const fields: any = [];
    get(this.selectedResource, 'metadata', []).forEach((metaField: any) => {
      get(this.selectedLayout, 'query.fields', []).forEach((field: any) => {
        if (field.name === metaField.name) {
          const type = metaField.type;
          fields.push({ ...field, type });
        }
      });
    });

    this.fields = fields;
  }

  /**
   * Updates modified aggregation
   *
   * @param aggregation the modified aggregation
   */
  handleAggregationChange(aggregation: Aggregation | null) {
    this.selectedAggregation = aggregation;
    this.getCustomAggregation();
  }
}
