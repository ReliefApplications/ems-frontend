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
import { AggregationBuilderService } from '../../../../services/aggregation-builder.service';

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

  /** @returns the aggregation form */
  public get aggregationForm(): FormGroup {
    return (
      ((this.formGroup?.controls.chart as FormGroup).controls
        .aggregation as FormGroup) || null
    );
  }

  private reload = new Subject<boolean>();
  public reload$ = this.reload.asObservable();

  constructor(
    private apollo: Apollo,
    private dialog: MatDialog,
    private aggregationBuilder: AggregationBuilderService
  ) {}

  ngOnInit(): void {
    this.formGroup.get('chart.type')?.valueChanges.subscribe((value) => {
      this.reload.next(true);
    });
    this.formGroup.get('resource')?.valueChanges.subscribe((value) => {
      this.getResource(value);
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

  private getResource(id: string): void {
    this.apollo
      .query<GetResourceByIdQueryResponse>({
        query: GET_RESOURCE,
        variables: {
          id,
        },
      })
      .subscribe((res) => {
        this.resource = res.data.resource;
      });
  }

  /**
   * Adds a new aggregation to the list.
   */
  public addAggregation(): void {
    const dialogRef = this.dialog.open(AddAggregationModalComponent, {
      data: {
        aggregations: this.resource?.aggregations,
        resource: this.resource,
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        if (typeof value === 'string') {
          this.formGroup.get('chart.aggregationId')?.setValue(value);
          this.aggregation = this.resource?.aggregations?.find(
            (x) => x.id === value
          );
          this.availableSeriesFields = this.aggregationBuilder.fieldsAfter(
            this.aggregation?.sourceFields,
            this.aggregation?.pipeline
          );
        } else {
          this.formGroup.get('chart.aggregationId')?.setValue(value.id);
          this.aggregation = value;
          this.availableSeriesFields = this.aggregationBuilder.fieldsAfter(
            this.aggregation?.sourceFields,
            this.aggregation?.pipeline
          );
        }
      }
    });
  }
}
