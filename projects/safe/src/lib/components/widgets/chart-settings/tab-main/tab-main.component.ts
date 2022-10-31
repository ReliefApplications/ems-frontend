import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Apollo, QueryRef } from 'apollo-angular';
import { Resource } from '../../../../models/resource.model';
import { Subject } from 'rxjs';
import { CHART_TYPES } from '../constants';
import {
  GetResourceByIdQueryResponse,
  GetResourcesQueryResponse,
  GET_RESOURCE,
  GET_RESOURCES,
} from '../graphql/queries';
import { AddAggregationModalComponent } from '../../../aggregation/add-aggregation-modal/add-aggregation-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { Aggregation } from '../../../../models/aggregation.model';
import { AggregationBuilderService } from '../../../../services/aggregation-builder/aggregation-builder.service';
import { QueryBuilderService } from '../../../../services/query-builder/query-builder.service';
import { SafeEditAggregationModalComponent } from '../../../aggregation/edit-aggregation-modal/edit-aggregation-modal.component';
import { SafeAggregationService } from '../../../../services/aggregation/aggregation.service';

/** Default items per query, for pagination */
const ITEMS_PER_PAGE = 10;

/**
 * Main tab of chart settings modal.
 */
@Component({
  selector: 'safe-tab-main',
  templateUrl: './tab-main.component.html',
  styleUrls: ['./tab-main.component.scss'],
})
export class TabMainComponent implements OnInit {
  @Input() formGroup!: FormGroup;
  @Input() type: any;
  public types = CHART_TYPES;
  public resourcesQuery!: QueryRef<GetResourcesQueryResponse>;
  public resource?: Resource;
  public aggregation?: Aggregation;
  public availableSeriesFields: any[] = [];

  private reload = new Subject<boolean>();
  public reload$ = this.reload.asObservable();

  /**
   * Main tab of chart settings modal.
   *
   * @param apollo Apollo service
   * @param dialog Material dialog service
   * @param aggregationBuilder Shared aggregation builder service
   * @param queryBuilder Shared query builder service
   * @param aggregationService Shared aggregation service
   */
  constructor(
    private apollo: Apollo,
    private dialog: MatDialog,
    private aggregationBuilder: AggregationBuilderService,
    private queryBuilder: QueryBuilderService,
    private aggregationService: SafeAggregationService
  ) {}

  ngOnInit(): void {
    this.formGroup.get('chart.type')?.valueChanges.subscribe((value) => {
      this.reload.next(true);
    });
    this.formGroup.get('resource')?.valueChanges.subscribe((value) => {
      this.getResource(value);
      this.formGroup.get('chart.aggregationId')?.setValue(null);
    });
    if (this.formGroup.value.resource) {
      this.getResource(this.formGroup.value.resource);
    }
    this.resourcesQuery = this.apollo.watchQuery<GetResourcesQueryResponse>({
      query: GET_RESOURCES,
      variables: {
        first: ITEMS_PER_PAGE,
        sortField: 'name',
      },
    });
  }

  /**
   * Get a resource by id and associated aggregations
   *
   * @param id resource id
   */
  private getResource(id: string): void {
    const aggregationId = this.formGroup.get('chart.aggregationId')?.value;
    this.apollo
      .query<GetResourceByIdQueryResponse>({
        query: GET_RESOURCE,
        variables: {
          id,
          aggregationIds: aggregationId ? [aggregationId] : null,
        },
      })
      .subscribe((res) => {
        this.resource = res.data.resource;
        if (aggregationId && this.resource.aggregations?.edges[0]) {
          this.aggregation = this.resource.aggregations.edges[0].node;
          this.setAvailableSeriesFields();
        }
      });
  }

  /**
   * Set available series fields, from resource fields and aggregation definition.
   */
  private setAvailableSeriesFields(): void {
    if (this.aggregation) {
      this.availableSeriesFields = this.aggregationBuilder.fieldsAfter(
        this.queryBuilder
          .getFields(this.resource?.queryName as string)
          .filter(
            (field: any) =>
              !(
                field.name.includes('_id') &&
                (field.type.name === 'ID' ||
                  (field.type.kind === 'LIST' &&
                    field.type.ofType.name === 'ID'))
              )
          ),
        this.aggregation?.pipeline
      );
    } else {
      this.availableSeriesFields = [];
    }
  }

  /**
   * Adds a new aggregation to the list.
   */
  public addAggregation(): void {
    const dialogRef = this.dialog.open(AddAggregationModalComponent, {
      data: {
        aggregations:
          this.resource?.aggregations?.edges.map((x) => x.node) || [],
        resource: this.resource,
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.formGroup.get('chart.aggregationId')?.setValue(value.id);
        this.aggregation = value;
        this.setAvailableSeriesFields();
        // this.getResource(this.resource?.id as string);
      }
    });
  }

  /**
   * Edit chosen aggregation, in a modal. If saved, update it.
   */
  public editAggregation(): void {
    const dialogRef = this.dialog.open(SafeEditAggregationModalComponent, {
      disableClose: true,
      data: {
        resource: this.resource,
        aggregation: this.aggregation,
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value && this.aggregation) {
        this.aggregationService
          .editAggregation(this.aggregation, value, this.resource?.id)
          .subscribe((res) => {
            if (res.data?.editAggregation) {
              this.getResource(this.resource?.id as string);
            }
          });
      }
    });
  }
}
