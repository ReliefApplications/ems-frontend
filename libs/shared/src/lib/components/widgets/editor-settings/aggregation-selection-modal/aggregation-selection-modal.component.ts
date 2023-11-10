import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { DialogRef } from '@angular/cdk/dialog';
import { Aggregation } from '../../../../models/aggregation.model';
import {
  Resource,
  ResourcesQueryResponse,
} from '../../../../models/resource.model';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AggregationBuilderModule } from '../../../ui/aggregation-builder/aggregation-builder.module';
import {
  ButtonModule,
  SelectMenuModule,
  FormWrapperModule,
  DialogModule,
  GraphQLSelectModule,
  DividerModule,
  TooltipModule,
} from '@oort-front/ui';
import { Apollo, QueryRef } from 'apollo-angular';
import { GET_RESOURCES } from '../graphql/queries';
import { AggregationTableModule } from '../../../aggregation/aggregation-table/aggregation-table.module';
import { FormBuilder } from '@angular/forms';
import { Dialog } from '@angular/cdk/dialog';
import { get } from 'lodash';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs';
import { AggregationService } from '../../../../services/aggregation/aggregation.service';

/** Default items per query, for pagination */
const ITEMS_PER_PAGE = 10;

@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FormWrapperModule,
    DialogModule,
    AggregationBuilderModule,
    ButtonModule,
    SelectMenuModule,
    FormWrapperModule,
    GraphQLSelectModule,
    DividerModule,
    AggregationTableModule,
    TooltipModule,
  ],
  selector: 'shared-aggregation-selection-modal',
  templateUrl: './aggregation-selection-modal.component.html',
  styleUrls: ['./aggregation-selection-modal.component.scss'],
})
export class AggregationSelectionModalComponent
  extends UnsubscribeComponent
  implements OnInit
{
  public formGroup!: FormGroup;
  public resource!: Resource;

  public resourcesQuery!: QueryRef<ResourcesQueryResponse>;
  public selectedResource: Resource | null = null;
  public selectedAggregation: Aggregation | null = null;

  /**
   * Modal to edit aggregation.
   *
   * @param dialogRef This is the reference of the dialog that will be opened.
   * @param dialog dialog
   * @param apollo Apollo
   * @param fb fb
   * @param aggregationService Shared aggregation service
   */
  constructor(
    public dialogRef: DialogRef<AggregationSelectionModalComponent>,
    private dialog: Dialog,
    private apollo: Apollo,
    private fb: FormBuilder,
    private aggregationService: AggregationService
  ) {
    super();
  }

  ngOnInit(): void {
    this.formGroup = this.fb.group({
      resource: this.fb.control(''),
      aggregation: this.fb.control(''),
    });
    this.resourcesQuery = this.apollo.watchQuery<ResourcesQueryResponse>({
      query: GET_RESOURCES,
      variables: {
        first: ITEMS_PER_PAGE,
        sortField: 'name',
      },
    });

    this.formGroup.get('resource')?.valueChanges.subscribe((val: any) => {
      this.selectedResource =
        this.resourcesQuery
          .getCurrentResult()
          .data.resources.edges.find((r) => r.node.id === val)?.node || null;
    });

    this.formGroup.get('aggregation')?.valueChanges.subscribe((val: any) => {
      console.log(val);
    });
  }

  /**
   * Changes the query according to search text
   *
   * @param search Search text from the graphql select
   */
  onResourceSearchChange(search: string): void {
    this.resourcesQuery.refetch({
      first: ITEMS_PER_PAGE,
      sortField: 'name',
      filter: {
        logic: 'and',
        filters: [
          {
            field: 'name',
            operator: 'contains',
            value: search,
          },
        ],
      },
    });
  }

  /**
   * Adds a new aggregation for the resource.
   */
  async addAggregation(): Promise<void> {
    const { AddAggregationModalComponent } = await import(
      '../../../aggregation/add-aggregation-modal/add-aggregation-modal.component'
    );
    const dialogRef = this.dialog.open(AddAggregationModalComponent, {
      data: {
        hasAggregations:
          get(this.selectedResource, 'aggregations.totalCount', 0) > 0, // check if at least one existing aggregation
        resource: this.selectedResource,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value) {
        if (typeof value === 'string') {
          this.formGroup.get('aggregation')?.setValue(value);
        } else {
          this.formGroup.get('aggregation')?.setValue((value as any).id);
          this.selectedAggregation = value;
        }
      }
    });
  }

  /**
   * Edit chosen aggregation, in a modal. If saved, update it.
   */
  public async editAggregation(): Promise<void> {
    const { EditAggregationModalComponent } = await import(
      '../../../aggregation/edit-aggregation-modal/edit-aggregation-modal.component'
    );
    const dialogRef = this.dialog.open(EditAggregationModalComponent, {
      disableClose: true,
      data: {
        resource: this.selectedResource,
        aggregation: this.selectedAggregation,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value && this.selectedAggregation) {
        this.aggregationService
          .editAggregation(
            this.selectedAggregation,
            value,
            this.selectedResource?.id
          )
          .subscribe((res) => {
            this.selectedAggregation = res.data?.editAggregation || null;
          });
      }
    });
  }

  /**
   * Closes the modal sending form value.
   */
  onSubmit(): void {
    this.formGroup.get('aggregation')?.setValue(this.selectedAggregation);
    this.dialogRef.close(this.formGroup?.getRawValue());
  }
}
