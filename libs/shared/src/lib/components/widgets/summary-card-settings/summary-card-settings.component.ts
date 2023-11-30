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
import { GET_RESOURCE } from './graphql/queries';
import { takeUntil } from 'rxjs';
import { Form } from '../../../models/form.model';
import { createSummaryCardForm } from './summary-card-settings.forms';

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
  /** Widget configuration */
  @Input() widget: any;
  /** Emit changes applied to the settings */
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() change: EventEmitter<any> = new EventEmitter();
  /** Widget form group */
  public widgetFormGroup: SummaryCardFormT | undefined;
  /** Current resource */
  public selectedResource: Resource | null = null;
  /** Current layout */
  public selectedLayout: Layout | null = null;
  /** Current aggregation */
  public selectedAggregation: Aggregation | null = null;
  public customAggregation: any;
  /** Available fields */
  public fields: any[] = [];
  /** Available resource templates */
  public templates: Form[] = [];

  /** @returns a FormControl for the searchable field */
  get searchableControl(): FormControl {
    return this.widgetFormGroup?.get('widgetDisplay.searchable') as any;
  }

  /** @returns a FormControl for the usePagination field */
  get usePaginationControl(): FormControl {
    return this.widgetFormGroup?.get('widgetDisplay.usePagination') as any;
  }

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
    this.widgetFormGroup = createSummaryCardForm(
      this.widget.id,
      this.widget.settings
    );
    this.change.emit(this.widgetFormGroup);

    const resourceID = this.widgetFormGroup?.get('card.resource')?.value;
    if (resourceID) {
      this.getResource(resourceID);
    }
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
        this.selectedLayout = null;
        this.selectedAggregation = null;
        this.customAggregation = null;
        this.fields = [];
        if (value) {
          this.getResource(value);
        } else {
          this.selectedResource = null;
        }
      });

    // Subscribe to aggregation changes
    this.widgetFormGroup.controls.card.controls.aggregation.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        console.log('update aggregation');
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
        }
      });

    this.initSortFields();
  }

  /**
   * Detect the form changes to emit the new configuration.
   */
  ngAfterViewInit(): void {
    this.widgetFormGroup?.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.change.emit(this.widgetFormGroup);
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
    const form = this.widgetFormGroup;
    if (!form) return;
    const layoutID = form.get('card.layout')?.value;
    const aggregationID = form.get('card.aggregation')?.value;
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
          form.get('card.resource')?.patchValue(null);
          form.get('card.layout')?.patchValue(null);
          form.get('card.aggregation')?.patchValue(null);
          this.selectedResource = null;
          this.selectedLayout = null;
          this.selectedAggregation = null;
        } else {
          this.selectedResource = res.data.resource;
          if (layoutID) {
            this.selectedLayout =
              res.data?.resource.layouts?.edges[0]?.node || null;
            // extract data keys from metadata
            const fields: any = [];
            get(res, 'data.resource.metadata', []).map((metaField: any) => {
              get(this.selectedLayout, 'query.fields', []).map((field: any) => {
                if (field.name === metaField.name) {
                  const type = metaField.type;
                  fields.push({ ...field, type });
                }
              });
            });
            this.fields = fields;
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
   * Gets the custom aggregation
   * for the selected resource and aggregation.
   */
  private getCustomAggregation(): void {
    if (!this.selectedAggregation || !this.selectedResource?.id) return;
    this.aggregationService
      .aggregationDataQuery(
        this.selectedResource.id,
        this.selectedAggregation.id || ''
      )
      ?.subscribe((res) => {
        if (res.data?.recordsAggregation) {
          this.customAggregation = res.data.recordsAggregation;
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
}
