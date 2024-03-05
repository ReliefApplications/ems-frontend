import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChild,
} from '@angular/core';
import {
  Validators,
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
import { GET_REFERENCE_DATA, GET_RESOURCE } from './graphql/queries';
import { startWith, takeUntil } from 'rxjs';
import { Form } from '../../../models/form.model';
import { createSummaryCardForm } from './summary-card-settings.forms';
import {
  ReferenceData,
  ReferenceDataQueryResponse,
} from '../../../models/reference-data.model';
import { TabComponent, TabsComponent } from '@oort-front/ui';
import { WidgetService } from '../../../services/widget/widget.service';
import { WidgetSettings } from '../../../models/dashboard.model';

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
  implements
    OnInit,
    AfterViewInit,
    OnDestroy,
    WidgetSettings<typeof createSummaryCardForm>
{
  /** Widget configuration */
  @Input() widget: any;
  /** Emit changes applied to the settings */
  @Output() formChange: EventEmitter<SummaryCardFormT> = new EventEmitter();
  /** Widget form group */
  public widgetFormGroup!: SummaryCardFormT;
  /** Current reference data */
  public referenceData: ReferenceData | null = null;
  /** Current resource */
  public resource: Resource | null = null;
  /** Current layout */
  public layout: Layout | null = null;
  /** Current aggregation */
  public aggregation: Aggregation | null = null;
  /** Available fields */
  public fields: any[] = [];
  /** Available resource templates */
  public templates: Form[] = [];
  /** Settings tab items length before any node add/removal */
  private previousTabsLength = 0;
  /** Current active settings tab index */
  public activeSettingsTab = 0;

  /** @returns a FormControl for the searchable field */
  get searchableControl(): FormControl {
    return this.widgetFormGroup?.get('widgetDisplay.searchable') as any;
  }

  /** @returns a FormControl for the usePagination field */
  get usePaginationControl(): FormControl {
    return this.widgetFormGroup?.get('widgetDisplay.usePagination') as any;
  }

  /** Tabs component associated to summary card settings */
  @ViewChild(TabsComponent) tabsComponent!: TabsComponent;
  /** Html element containing widget custom style */
  private customStyle?: HTMLStyleElement;

  /**
   * Summary Card Settings component.
   *
   * @param apollo Apollo service
   * @param aggregationService Shared aggregation service
   * @param fb FormBuilder instance
   * @param widgetService Shared widget service
   */
  constructor(
    private apollo: Apollo,
    private aggregationService: AggregationService,
    private fb: FormBuilder,
    private widgetService: WidgetService
  ) {
    super();
  }

  ngOnInit(): void {
    // Initialize style
    this.widgetService
      .createCustomStyle('widgetPreview', this.widget)
      .then((customStyle) => {
        if (customStyle) {
          this.customStyle = customStyle;
        }
      });
    // Build settings
    if (!this.widgetFormGroup) {
      this.buildSettingsForm();
    }
    // Initialize resource
    const resourceID = this.widgetFormGroup?.get('card.resource')?.value;
    if (resourceID) {
      this.getResource(resourceID);
    }
    // Subscribe on resource changes
    this.widgetFormGroup.controls.card.controls.resource.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        // clear sort fields array
        const sortFields = this.widgetFormGroup?.get('sortFields') as FormArray;
        sortFields.clear();
        // clear layout, aggregation, template
        this.widgetFormGroup?.get('card.template')?.setValue(null);
        this.widgetFormGroup?.get('card.layout')?.setValue(null);
        this.widgetFormGroup?.get('card.aggregation')?.setValue(null);
        this.layout = null;
        this.aggregation = null;
        this.fields = [];
        if (value) {
          this.referenceData = null;
          this.widgetFormGroup.controls.card.controls.showDataSourceLink.enable();
          this.getResource(value);
        } else {
          this.resource = null;
        }
      });

    // Initialize reference data
    const referenceDataID =
      this.widgetFormGroup?.get('card.referenceData')?.value;
    if (referenceDataID) {
      this.getReferenceData(referenceDataID);
    }
    // Subscribe on reference data changes
    this.widgetFormGroup.controls.card.controls.referenceData.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          this.resource = null;
          this.widgetFormGroup.controls.card.controls.showDataSourceLink.disable();
          this.getReferenceData(value);
        } else {
          this.referenceData = null;
        }
      });

    // Subscribe to aggregation changes
    this.widgetFormGroup.controls.card.controls.aggregation.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        // disable searchable if aggregation is selected
        if (value) {
          const searchableControl = this.widgetFormGroup?.get(
            'widgetDisplay.searchable'
          );
          searchableControl?.setValue(false);
          searchableControl?.disable();
          // disable form actions if aggregation selected
          const actionsForm = this.widgetFormGroup?.controls.actions;
          // Prefer disabling all nested controls, so it automatically checks validation
          if (actionsForm) {
            Object.keys(actionsForm.controls).forEach((controlName: any) => {
              actionsForm.get(controlName)?.disable();
            });
          }
          if (this.widgetFormGroup?.controls.card.value.resource) {
            this.getResource(
              this.widgetFormGroup?.controls.card.value.resource
            );
          }
        } else {
          this.aggregation = null;
        }
      });

    // Subscribe to layout changes
    this.widgetFormGroup.controls.card.controls.layout.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          this.widgetFormGroup?.get('widgetDisplay.searchable')?.enable();
          // enable form actions if aggregation selected
          this.widgetFormGroup?.controls.actions.enable();
          if (this.widgetFormGroup?.controls.card.value.resource) {
            this.getResource(
              this.widgetFormGroup?.controls.card.value.resource
            );
          }
        } else {
          this.layout = null;
        }
      });

    this.initSortFields();
  }

  override ngOnDestroy(): void {
    // Remove the custom style when the component is destroyed
    if (this.customStyle) {
      this.customStyle.remove();
    }
  }

  /**
   * Detect the form changes to emit the new configuration.
   */
  ngAfterViewInit(): void {
    this.widgetFormGroup?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.widgetFormGroup.markAsDirty({ onlySelf: true });
        this.formChange.emit(this.widgetFormGroup);
      });

    this.tabsComponent.tabs.changes
      .pipe(startWith(this.tabsComponent.tabs), takeUntil(this.destroy$))
      .subscribe((tabs: QueryList<TabComponent>) => {
        // Update selectedIndex according to the absolute number of tabs added/removed
        // only if active tab distinct of first one
        const tabsDifference = Math.abs(tabs.length - this.previousTabsLength);
        // Would not trigger on first load, only if tab items length changes after tabs are set
        if (
          tabsDifference &&
          this.activeSettingsTab &&
          this.previousTabsLength
        ) {
          if (this.previousTabsLength < tabs.length) {
            this.activeSettingsTab += tabsDifference;
          } else if (this.previousTabsLength > tabs.length) {
            this.activeSettingsTab -= tabsDifference;
          }
          // Open tab again with all loaded values
          this.tabsComponent.tabs
            .toArray()
            .at(this.activeSettingsTab)
            ?.openTab.emit();
        }
        this.previousTabsLength = tabs.length;
      });
  }

  /**
   * Adds sortFields to the form group
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
   * Get resource by id, doing graphQL query
   *
   * @param id resource id
   */
  private getResource(id: string): void {
    const formValue = this.widgetFormGroup.getRawValue();
    const layoutID = get(formValue, 'card.layout');
    const aggregationID = get(formValue, 'card.aggregation');
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
      .subscribe(({ data, errors }) => {
        if (errors) {
          this.widgetFormGroup.get('card.resource')?.patchValue(null);
          this.widgetFormGroup.get('card.layout')?.patchValue(null);
          this.widgetFormGroup.get('card.aggregation')?.patchValue(null);
          this.resource = null;
          this.layout = null;
          this.aggregation = null;
        } else {
          this.resource = data.resource;
          if (layoutID) {
            this.layout = data?.resource.layouts?.edges[0]?.node || null;
            // extract data keys from metadata
            const fields: any = [];
            get(data, 'resource.metadata', []).map((metaField: any) => {
              get(this.layout, 'query.fields', []).map((field: any) => {
                if (field.name === metaField.name) {
                  const type = metaField.type;
                  fields.push({ ...field, type });
                }
              });
            });
            this.fields = fields;
          }
          if (aggregationID) {
            this.aggregation =
              data?.resource.aggregations?.edges[0]?.node || null;
            this.getCustomAggregation();
          }
        }
      });
  }

  /**
   * Get reference data by id
   *
   * @param id reference data id
   */
  private getReferenceData(id: string): void {
    this.apollo
      .query<ReferenceDataQueryResponse>({
        query: GET_REFERENCE_DATA,
        variables: {
          id,
        },
      })
      .subscribe(({ data, errors }) => {
        if (errors) {
          this.widgetFormGroup.get('card.referenceData')?.patchValue(null);
          this.referenceData = null;
        } else {
          this.referenceData = data.referenceData;
          this.fields = (this.referenceData.fields || [])
            .filter((field) => field && typeof field !== 'string')
            .map((field) => {
              return {
                label: field.name,
                name: field.name,
                type: field.type,
              };
            });
        }
      });
  }

  /**
   * Gets the custom aggregation
   * for the selected resource and aggregation.
   */
  private getCustomAggregation(): void {
    if (!this.aggregation || !this.resource?.id) return;
    this.aggregationService
      .aggregationDataQuery({
        resource: this.resource.id,
        aggregation: this.aggregation.id || '',
      })
      ?.subscribe(({ data }: any) => {
        if (data.recordsAggregation) {
          const customAggregation = data.recordsAggregation;
          this.fields = customAggregation.items[0]
            ? Object.keys(customAggregation.items[0]).map((f) => ({
                name: f,
                editor: 'text',
              }))
            : [];
        }
      });
  }

  /**
   * Build the settings form, using the widget saved parameters.
   */
  public buildSettingsForm() {
    this.widgetFormGroup = createSummaryCardForm(
      this.widget.id,
      this.widget.settings,
      this.destroy$
    );
  }
}
