import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormArray, UntypedFormGroup } from '@angular/forms';
import { BehaviorSubject, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { AggregationBuilderService } from '../../../services/aggregation-builder/aggregation-builder.service';
import { QueryBuilderService } from '../../../services/query-builder/query-builder.service';
import { Resource } from '../../../models/resource.model';
import { SafeUnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';

/**
 * Main component of Aggregation builder.
 * Aggregation are used to generate charts.
 */
@Component({
  selector: 'safe-aggregation-builder',
  templateUrl: './aggregation-builder.component.html',
  styleUrls: ['./aggregation-builder.component.scss'],
})
export class SafeAggregationBuilderComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  // === REACTIVE FORM ===
  @Input() aggregationForm: UntypedFormGroup = new UntypedFormGroup({});
  @Input() resource!: Resource;

  @Input() reload$!: Observable<boolean>;

  // === DATA ===
  public loading = true;

  // === FIELDS ===
  private fields = new BehaviorSubject<any[]>([]);
  public fields$!: Observable<any[]>;
  private selectedFields = new BehaviorSubject<any[]>([]);
  public selectedFields$!: Observable<any[]>;
  private metaFields = new BehaviorSubject<any[]>([]);
  public metaFields$!: Observable<any[]>;
  private mappingFields = new BehaviorSubject<any[]>([]);
  public mappingFields$!: Observable<any[]>;

  /**
   * Getter for the pipeline of the aggregation form
   *
   * @returns the pipelines in a FormArray
   */
  get pipelineForm(): UntypedFormArray {
    return this.aggregationForm.get('pipeline') as UntypedFormArray;
  }

  /**
   * Constructor for the aggregation builder
   *
   * @param queryBuilder This is a service that is used to build queries.
   * @param aggregationBuilder This is the service that will be used to build the aggregation query.
   */
  constructor(
    private queryBuilder: QueryBuilderService,
    private aggregationBuilder: AggregationBuilderService
  ) {
    super();
  }

  ngOnInit(): void {
    this.initFields();

    // Fields query
    this.fields$ = this.fields.asObservable();
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
    this.metaFields$ = this.metaFields.asObservable();
    this.aggregationForm
      .get('sourceFields')
      ?.valueChanges.pipe(debounceTime(1000))
      .pipe(takeUntil(this.destroy$))
      .subscribe((fieldsNames: string[]) => {
        this.updateSelectedAndMetaFields(fieldsNames);
      });

    // Preview grid and mapping fields
    this.mappingFields$ = this.mappingFields.asObservable();
    this.aggregationForm
      .get('pipeline')
      ?.valueChanges.pipe(debounceTime(1000))
      .pipe(takeUntil(this.destroy$))
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
    this.loading = false;
  }

  /**
   * Initializes all data necessary for the reactive form to work.
   */
  private initFields(): void {
    this.updateFields();
    this.updateSelectedAndMetaFields(this.aggregationForm.value.sourceFields);
  }

  /**
   * Updates fields depending on selected form.
   */
  private updateFields(): void {
    const fields = this.queryBuilder
      .getFields(this.resource.queryName as string)
      .filter(
        (field: any) =>
          !(
            field.name.includes('_id') &&
            (field.type.name === 'ID' ||
              (field.type?.kind === 'LIST' && field.type.ofType.name === 'ID'))
          )
      );
    this.fields.next(fields);
  }

  /**
   * Updates selected, meta and mapping fields depending on tagbox value.
   *
   * @param fieldsNames Tagbox value.
   */
  private updateSelectedAndMetaFields(fieldsNames: string[]): void {
    if (fieldsNames && fieldsNames.length) {
      const currentFields = this.fields.value;
      const selectedFields = fieldsNames.map((x: string) => {
        const field = { ...currentFields.find((y) => x === y.name) };
        if (field.type?.kind !== 'SCALAR') {
          field.fields = this.queryBuilder
            .getFieldsFromType(
              field.type?.kind === 'OBJECT'
                ? field.type.name
                : field.type.ofType.name
            )
            .filter((y) => y.type.name !== 'ID' && y.type?.kind === 'SCALAR');
        }
        return field;
      });

      this.selectedFields.next(selectedFields);

      this.mappingFields.next(
        this.aggregationBuilder.fieldsAfter(
          selectedFields,
          this.aggregationForm.get('pipeline')?.value
        )
      );
    } else {
      this.selectedFields.next([]);
      this.metaFields.next([]);
      this.mappingFields.next([]);
    }
  }
}
