import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AggregationBuilderService } from '../../../services/aggregation-builder/aggregation-builder.service';
import { QueryBuilderService } from '../../../services/query-builder/query-builder.service';
import { Resource } from '../../../models/resource.model';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';
import { Metadata } from '../../../models/metadata.model';
import { ReferenceData } from '../../../models/reference-data.model';
import { Dialog } from '@angular/cdk/dialog';
import { AggregationService } from '../../../services/aggregation/aggregation.service';
import { getReferenceMetadata } from '../../../utils/reference-data-metadata.util';
import { PipelineStage } from './pipeline/pipeline-stage.enum';

/**
 * Main component of Aggregation builder.
 * Aggregation are used to generate charts.
 */
@Component({
  selector: 'shared-aggregation-builder',
  templateUrl: './aggregation-builder.component.html',
  styleUrls: ['./aggregation-builder.component.scss'],
})
export class AggregationBuilderComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Aggregation reactive form group */
  @Input() aggregationForm: UntypedFormGroup = new UntypedFormGroup({});
  /** Current resource */
  @Input() resource?: Resource;
  /** Current reference data */
  @Input() referenceData?: ReferenceData;
  /** Loading indicator */
  public loading = true;
  /** Available fields */
  private fields = new BehaviorSubject<any[]>([]);
  /** Available fields as observable */
  public fields$ = this.fields.asObservable();
  /** Available filter fields */
  private filterFields = new BehaviorSubject<any[]>([]);
  /** Available filter fields as observable */
  public filterFields$!: Observable<any[]>;
  /** Selected filter fields */
  private selectedFilterFields = new BehaviorSubject<any[]>([]);
  /** Selected filter fields as observable */
  public selectedFilterFields$!: Observable<any[]>;
  /** Selected fields */
  private selectedFields = new BehaviorSubject<any[]>([]);
  /** Selected fields as observable */
  public selectedFields$!: Observable<any[]>;
  /** Fields available for mapping */
  private mappingFields = new BehaviorSubject<any[]>([]);
  /** Fields available for mapping as observable */
  public mappingFields$!: Observable<any[]>;
  /** Aggregation records loading state */
  public loadingAggregationRecords = false;
  /** Array to hold the list of stages allowed for aggregation data source type. */
  public stageList!: string[];
  /** Result of the current pipeline */
  public pipelinePreview: any;
  /** Whether or not to display the aggregation result preview */
  public showPreview = false;
  /** Monaco editor options */
  readonly editorOptions = {
    theme: 'vs-dark',
    language: 'json',
    fixedOverflowWidgets: false,
    minimap: {
      enabled: false,
    },
    lineNumbers: 'off',
    automaticLayout: true,
  };
  /** The text displayed in the aggregation result preview */
  public aggregationPreview = '';

  /**
   * Getter for the pipeline of the aggregation form
   *
   * @returns the pipelines in a FormArray
   */
  get pipelineForm(): UntypedFormArray {
    return this.aggregationForm.get('pipeline') as UntypedFormArray;
  }

  /**
   * Main component of Aggregation builder.
   * Aggregation are used to generate charts.
   *
   * @param dialog CDK dialog service
   * @param aggregationService Shared Aggregation Service
   * @param queryBuilder Shared query builder service
   * @param aggregationBuilder Shared aggregation builder service
   */
  constructor(
    private dialog: Dialog,
    private aggregationService: AggregationService,
    private queryBuilder: QueryBuilderService,
    private aggregationBuilder: AggregationBuilderService
  ) {
    super();
  }

  ngOnInit(): void {
    // Fixes issue where sometimes we try to load the fields before the queries are loaded
    this.queryBuilder.availableQueries$
      .pipe(takeUntil(this.destroy$))
      .subscribe((queryList) => {
        if (queryList.length > 0) {
          this.initFields();
        }
      });

    this.stageList = this.referenceData
      ? Object.values(PipelineStage).filter(
          // Disable "custom" stage for reference data aggregations
          (stage: string) => stage !== PipelineStage.CUSTOM
        )
      : Object.values(PipelineStage);

    // Fields query
    this.fields$.pipe(takeUntil(this.destroy$)).subscribe((fields) => {
      fields.forEach((field) => {
        field['used'] = this.pipelineForm.value.some((x: any) => {
          return (
            x.form.groupBy?.find((y: any) => y.field?.includes(field.name)) || // group
            x.form.field?.includes(field.name) || // sort & Unwind
            x.form.filters?.find((y: any) => y.field?.includes(field.name)) // filters
          );
        });
      });
    });

    // Meta selected fields query
    this.selectedFields$ = this.selectedFields.asObservable();

    this.filterFields$ = this.filterFields.asObservable();
    this.selectedFilterFields$ = this.selectedFilterFields.asObservable();

    this.aggregationForm
      .get('sourceFields')
      ?.valueChanges.pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe((fieldsNames: string[]) => {
        this.updateSelectedAndMetaFields(fieldsNames);
      });

    // Preview grid and mapping fields
    this.mappingFields$ = this.mappingFields.asObservable();
    this.aggregationForm
      .get('pipeline')
      ?.valueChanges.pipe(debounceTime(1000), takeUntil(this.destroy$))
      .subscribe((pipeline) => {
        this.mappingFields.next(
          this.aggregationBuilder.fieldsAfter(
            this.selectedFields.value,
            pipeline
          )
        );
        // Trigger check on fields being removable or not
        this.fields.next(this.fields.getValue());
      });

    // For the result preview
    this.aggregationForm.valueChanges
      .pipe(takeUntil(this.destroy$), debounceTime(1000))
      .subscribe((value) => {
        if (!this.resource?.id) {
          return;
        }
        this.aggregationService
          .aggregationDataQuery({
            resource: this.resource.id,
            aggregation: {
              pipeline: (value.pipeline ?? []).filter((x: any) => x.preview),
              sourceFields: value.sourceFields,
            },
          })
          .subscribe((result) => {
            // Update the preview with the error message
            if (result.errors?.[0]) {
              this.aggregationPreview = result.errors[0].message;
              return;
            }

            // Update the preview with the items from the aggregation
            this.aggregationPreview = JSON.stringify(
              'recordsAggregation' in result.data &&
                result.data?.recordsAggregation?.items
                ? result.data?.recordsAggregation?.items
                : 'referenceDataAggregation' in result.data &&
                  result.data?.referenceDataAggregation?.items
                ? result.data?.referenceDataAggregation?.items
                : '',
              null,
              2
            );
          });
      });
    this.loading = false;
  }

  /**
   * Get the filter fields needed for the current resource
   */
  private setFilterFields(): void {
    const updateSelectedFilterFields = () => {
      // On first load we update the selected filter fields from this function
      // As the getFilterFields request takes time to complete
      if (!this.selectedFilterFields.value.length) {
        const currentFilterFields = this.filterFields.value.filter((mfi) =>
          this.selectedFields.value.find((si) => si.name === mfi.name)
        );
        this.selectedFilterFields.next(currentFilterFields);
      }
    };
    if (this.resource) {
      this.queryBuilder
        .getFilterFields({
          name: this.resource.queryName as string,
        })
        .then((filterFields: Metadata[]) => {
          this.filterFields.next(filterFields);
          updateSelectedFilterFields();
        });
    } else if (this.referenceData) {
      const refDataMeta = getReferenceMetadata(this.referenceData);
      this.filterFields.next(refDataMeta);
      updateSelectedFilterFields();
    }
  }

  /**
   * Initializes all data necessary for the reactive form to work.
   */
  private initFields(): void {
    this.setFilterFields();
    this.updateFields();
    this.updateSelectedAndMetaFields(this.aggregationForm.value.sourceFields);
  }

  /**
   * Updates fields depending on selected form.
   */
  private updateFields(): void {
    if (this.resource) {
      const fields = this.queryBuilder
        .getFields(this.resource.queryName as string)
        .filter(
          (field: any) =>
            !(
              field.name.includes('_id') &&
              (field.type.name === 'ID' ||
                (field.type?.kind === 'LIST' &&
                  field.type.ofType.name === 'ID'))
            )
        );
      this.fields.next(fields);
    } else if (this.referenceData) {
      const fields = this.queryBuilder
        .getFields(this.referenceData.graphQLTypeName as string)
        .filter(
          (field: any) =>
            !(
              field.name.includes('_id') &&
              (field.type.name === 'ID' ||
                (field.type?.kind === 'LIST' &&
                  field.type.ofType.name === 'ID'))
            )
        );
      this.fields.next(fields);
    }
  }

  /**
   * Updates selected, meta and mapping fields depending on selected fields value.
   *
   * @param fieldsNames selected fields' names
   */
  private updateSelectedAndMetaFields(fieldsNames: string[]): void {
    if (fieldsNames && fieldsNames.length) {
      if (this.resource || this.referenceData) {
        const currentFields = this.fields.value;
        const selectedFields = fieldsNames.map((x: string) => {
          const field = { ...currentFields.find((y) => x === y.name) };
          if (field.type?.kind !== 'SCALAR') {
            field.fields = this.queryBuilder.deconfineFields(
              field.type,
              new Set()
                .add(
                  this.resource ? this.resource.name : this.referenceData?.name
                )
                .add(field.type.name ?? field.type.ofType.name)
            );
          }
          return field;
        });

        const currentFilterFields = this.filterFields.value.filter((x) =>
          selectedFields.find((y) => y.name === x.name)
        );
        this.selectedFilterFields.next(currentFilterFields);

        this.selectedFields.next(selectedFields);

        this.mappingFields.next(
          this.aggregationBuilder.fieldsAfter(
            selectedFields,
            this.aggregationForm.get('pipeline')?.value
          )
        );
      }
    } else {
      this.selectedFields.next([]);
      this.selectedFilterFields.next([]);
      this.mappingFields.next([]);
    }
  }
}
