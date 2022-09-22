import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Apollo, QueryRef } from 'apollo-angular';
import { createAggregationForm } from '../../../../ui/aggregation-builder/aggregation-builder-forms';
import { GET_RESOURCES, GetResourcesQueryResponse } from '../graphql/queries';
import { Resource } from '../../../../../models/resource.model';
import { Layout } from '../../../../../models/layout.model';
import { Aggregation } from '../../../../../models/aggregation.model';
import { MatDialog } from '@angular/material/dialog';
import { AddLayoutModalComponent } from '../../../../grid-layout/add-layout-modal/add-layout-modal.component';
import { SafeEditLayoutModalComponent } from '../../../../grid-layout/edit-layout-modal/edit-layout-modal.component';
import { SafeGridLayoutService } from '../../../../../services/grid-layout.service';
import { SafeAggregationService } from '../../../../../services/aggregation/aggregation.service';
import { get } from 'lodash';
import { SafeEditAggregationModalComponent } from '../../../../aggregation/edit-aggregation-modal/edit-aggregation-modal.component';
import { AddAggregationModalComponent } from '../../../../aggregation/add-aggregation-modal/add-aggregation-modal.component';

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
export class SafeDataSourceTabComponent implements OnInit {
  @Input() form!: FormGroup;

  @Input() selectedResource: Resource | null = null;
  @Input() selectedLayout: Layout | null = null;
  @Input() selectedAggregation: Aggregation | null = null;

  @Output() layoutChange = new EventEmitter<Layout | null>();
  @Output() aggregationChange = new EventEmitter<Aggregation | null>();

  // === RADIO ===
  public radioValue = false;

  // === DATA ===
  public resourcesQuery!: QueryRef<GetResourcesQueryResponse>;

  /**
   * SafeDataSourceTabComponent constructor
   *
   * @param apollo Used for getting the resources and layouts query
   * @param dialog Used for opening the modal for layout selection/creation
   * @param gridLayoutService Used for editing/adding layouts
   * @param aggregationService Used for editing/adding aggregations
   */
  constructor(
    private apollo: Apollo,
    private dialog: MatDialog,
    private gridLayoutService: SafeGridLayoutService,
    private aggregationService: SafeAggregationService
  ) {}

  /**
   * Gets the selected resource data
   */
  ngOnInit(): void {
    // Initialize radioValue
    this.radioValue = this.form.value.isAggregation;

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

  /**
   * Changes the form value assigned to the radio component.
   *
   * @param event Event with the change values.
   */
  radioChange(event: any) {
    this.radioValue = event.value;
    this.form.patchValue({ isAggregation: event.value });
  }

  /** Opens modal for layout selection/creation */
  public addLayout() {
    const dialogRef = this.dialog.open(AddLayoutModalComponent, {
      data: {
        resource: this.selectedResource,
        hasLayouts: get(this.selectedResource, 'layouts.totalCount', 0) > 0,
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        if (typeof value === 'string') {
          this.form.get('layout')?.setValue(value);
        } else {
          this.form.get('layout')?.setValue(value.id);
        }
      }
    });
  }

  /**
   * Edit chosen layout, in a modal. If saved, update it.
   */
  public editLayout(): void {
    const dialogRef = this.dialog.open(SafeEditLayoutModalComponent, {
      disableClose: true,
      data: {
        layout: this.selectedLayout,
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
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
  addAggregation(): void {
    const dialogRef = this.dialog.open(AddAggregationModalComponent, {
      data: {
        hasAggregations:
          get(this.selectedResource, 'aggregations.totalCount', 0) > 0, // check if at least one existing aggregation
        resource: this.selectedResource,
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        if (typeof value === 'string') {
          this.form.get('aggregation')?.setValue(value);
        } else {
          this.form.get('aggregation')?.setValue(value.id);
        }
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
        resource: this.selectedResource,
        aggregation: this.selectedAggregation,
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
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
}
