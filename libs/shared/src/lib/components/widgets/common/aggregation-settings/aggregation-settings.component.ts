import { Component, OnInit, Input } from '@angular/core';
import { Aggregation } from '../../../../models/aggregation.model';
import {
  Resource,
  ResourceQueryResponse,
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
  AlertModule,
} from '@oort-front/ui';
import { Apollo, QueryRef } from 'apollo-angular';
import { GET_RESOURCES, GET_RESOURCE } from './graphql/queries';
import { AggregationTableModule } from '../../../aggregation/aggregation-table/aggregation-table.module';
import { Dialog } from '@angular/cdk/dialog';
import { get } from 'lodash';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs';
import { AggregationService } from '../../../../services/aggregation/aggregation.service';
import { AggregationBuilderService } from '../../../../services/aggregation-builder/aggregation-builder.service';
import { SeriesMappingModule } from '../../../ui/aggregation-builder/series-mapping/series-mapping.module';

/** Default items per query, for pagination */
const ITEMS_PER_PAGE = 10;

/**
 * Aggregation Settings component.
 */
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
    AlertModule,
    SeriesMappingModule,
  ],
  selector: 'shared-aggregation-settings',
  templateUrl: './aggregation-settings.component.html',
  styleUrls: ['./aggregation-settings.component.scss'],
})
export class AggregationSettingsComponent
  extends UnsubscribeComponent
  implements OnInit
{
  @Input() formGroup!: any;
  public resource!: Resource;

  public resourcesQuery!: QueryRef<ResourcesQueryResponse>;
  public selectedResource: Resource | null = null;
  public selectedAggregation?: Aggregation | null = null;
  public availableSeriesFields: any[] = [];

  /**
   * Modal to edit aggregation.
   *
   * @param dialog dialog
   * @param apollo Apollo
   * @param aggregationService Shared aggregation service
   * @param aggregationBuilder Shared aggregation builder service
   */
  constructor(
    private dialog: Dialog,
    private apollo: Apollo,
    private aggregationService: AggregationService,
    private aggregationBuilder: AggregationBuilderService
  ) {
    super();
  }

  ngOnInit(): void {
    const resourceID = this.formGroup?.get('aggregation.resource')?.value;
    if (resourceID) {
      this.getResource(resourceID);
    }

    this.resourcesQuery = this.apollo.watchQuery<ResourcesQueryResponse>({
      query: GET_RESOURCES,
      variables: {
        first: ITEMS_PER_PAGE,
        sortField: 'name',
      },
    });

    this.formGroup
      .get('aggregation.resource')
      ?.valueChanges.subscribe((val: any) => {
        this.selectedResource =
          this.resourcesQuery
            .getCurrentResult()
            .data.resources.edges.find((r) => r.node.id === val)?.node || null;
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
   * Get resource by id, doing graphQL query
   *
   * @param id resource id
   */
  private getResource(id: string): void {
    const form = this.formGroup;
    if (!form) return;
    const aggregationID = form.get('aggregation.id')?.value;
    this.apollo
      .query<ResourceQueryResponse>({
        query: GET_RESOURCE,
        variables: {
          id,
          aggregation: aggregationID ? [aggregationID] : undefined,
        },
      })
      .subscribe((res) => {
        if (res.errors) {
          form.get('aggregation.resource')?.patchValue(null);
          form.get('aggregation.id')?.patchValue(null);
          form.get('aggregation.name')?.patchValue(null);
          this.selectedResource = null;
          this.selectedAggregation = null;
        } else {
          this.selectedResource = res.data.resource;
          if (aggregationID) {
            this.selectedAggregation =
              res.data?.resource.aggregations?.edges[0]?.node || null;
            this.availableSeriesFields =
              this.aggregationBuilder.getAvailableSeriesFields(
                this.selectedAggregation ?? undefined,
                this.selectedResource ?? undefined
              );
          }
        }
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
          this.formGroup.get('aggregation.id')?.setValue(value);
        } else {
          this.formGroup.get('aggregation.id')?.setValue((value as any).id);
          this.formGroup.get('aggregation.name')?.setValue((value as any).name);
          this.selectedAggregation = value;
        }
        this.availableSeriesFields =
          this.aggregationBuilder.getAvailableSeriesFields(
            this.selectedAggregation ?? undefined,
            this.selectedResource ?? undefined
          );
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
}
