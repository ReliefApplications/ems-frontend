import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Apollo, QueryRef } from 'apollo-angular';
import { GET_RESOURCES, GetResourcesQueryResponse } from '../graphql/queries';
import { Resource } from '../../../../../models/resource.model';
import { Layout } from '../../../../../models/layout.model';
import { Aggregation } from '../../../../../models/aggregation.model';
import { SafeGridLayoutService } from '../../../../../services/grid-layout/grid-layout.service';
import { SafeAggregationService } from '../../../../../services/aggregation/aggregation.service';
import { get } from 'lodash';
import { Dialog } from '@angular/cdk/dialog';
import { takeUntil } from 'rxjs';
import { SafeUnsubscribeComponent } from '../../../../utils/unsubscribe/unsubscribe.component';

/**
 * How many resources.forms will be shown on the selector.
 */
const ITEMS_PER_PAGE = 10;

/**
 * Component used in the card-modal-settings for selecting the resource and layout.
 */
@Component({
  selector: 'safe-data-source-tab',
  templateUrl: './data-source-tab.component.html',
  styleUrls: ['./data-source-tab.component.scss'],
})
export class SafeDataSourceTabComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  @Input() form!: UntypedFormGroup;

  @Input() selectedResource: Resource | null = null;
  @Input() selectedLayout: Layout | null = null;
  @Input() selectedAggregation: Aggregation | null = null;

  @Output() layoutChange = new EventEmitter<Layout | null>();
  @Output() aggregationChange = new EventEmitter<Aggregation | null>();

  // === DATA ===
  public resourcesQuery!: QueryRef<GetResourcesQueryResponse>;

  /**
   * SafeDataSourceTabComponent constructor
   *
   * @param apollo Apollo service
   * @param dialog Material dialog service
   * @param gridLayoutService Shared dataset layout service
   * @param aggregationService Shared aggregation service
   */
  constructor(
    private apollo: Apollo,
    private dialog: Dialog,
    private gridLayoutService: SafeGridLayoutService,
    private aggregationService: SafeAggregationService
  ) {
    super();
  }

  /**
   * Gets the selected resource data
   */
  ngOnInit(): void {
    // Data source query
    const variables: any = {
      first: ITEMS_PER_PAGE,
      sortField: 'name',
    };

    this.resourcesQuery = this.apollo.watchQuery<GetResourcesQueryResponse>({
      query: GET_RESOURCES,
      variables,
    });
  }

  /** Opens modal for layout selection/creation */
  public async addLayout() {
    const { AddLayoutModalComponent } = await import(
      '../../../../grid-layout/add-layout-modal/add-layout-modal.component'
    );
    const dialogRef = this.dialog.open(AddLayoutModalComponent, {
      data: {
        resource: this.selectedResource,
        hasLayouts: get(this.selectedResource, 'layouts.totalCount', 0) > 0,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        if (typeof value === 'string') {
          this.form.get('layout')?.setValue(value);
        } else {
          this.form.get('layout')?.setValue(value.id);
        }
        this.form.patchValue({ isAggregation: false });
      }
    });
  }

  /**
   * Edit chosen layout, in a modal. If saved, update it.
   */
  public async editLayout(): Promise<void> {
    const { SafeEditLayoutModalComponent } = await import(
      '../../../../grid-layout/edit-layout-modal/edit-layout-modal.component'
    );
    const dialogRef = this.dialog.open(SafeEditLayoutModalComponent, {
      disableClose: true,
      data: {
        layout: this.selectedLayout,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value && this.selectedLayout) {
        this.gridLayoutService
          .editLayout(this.selectedLayout, value, this.selectedResource?.id)
          .subscribe((res: any) => {
            this.layoutChange.emit(res.data?.editLayout || null);
          });
      }
    });
  }

  /**
   * Adds a new aggregation for the resource.
   */
  async addAggregation(): Promise<void> {
    const { AddAggregationModalComponent } = await import(
      '../../../../aggregation/add-aggregation-modal/add-aggregation-modal.component'
    );
    const dialogRef = this.dialog.open(AddAggregationModalComponent, {
      data: {
        hasAggregations:
          get(this.selectedResource, 'aggregations.totalCount', 0) > 0, // check if at least one existing aggregation
        resource: this.selectedResource,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        if (typeof value === 'string') {
          this.form.get('aggregation')?.setValue(value);
        } else {
          this.form.get('aggregation')?.setValue(value.id);
        }
        this.form.patchValue({ isAggregation: true });
      }
    });
  }

  /**
   * Edit chosen aggregation, in a modal. If saved, update it.
   */
  public async editAggregation(): Promise<void> {
    const { SafeEditAggregationModalComponent } = await import(
      '../../../../aggregation/edit-aggregation-modal/edit-aggregation-modal.component'
    );
    const dialogRef = this.dialog.open(SafeEditAggregationModalComponent, {
      disableClose: true,
      data: {
        resource: this.selectedResource,
        aggregation: this.selectedAggregation,
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value && this.selectedAggregation) {
        this.aggregationService
          .editAggregation(
            this.selectedAggregation,
            value,
            this.selectedResource?.id
          )
          .subscribe((res) => {
            this.aggregationChange.emit(res.data?.editAggregation || null);
          });
      }
    });
  }

  /**
   * Changes the query according to search text
   *
   * @param search Search text from the graphql select
   */
  public onResourceSearchChange(search: string): void {
    const variables = this.resourcesQuery.variables;
    this.resourcesQuery.refetch({
      ...variables,
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
}
