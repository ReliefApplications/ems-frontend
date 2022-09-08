import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Apollo, QueryRef } from 'apollo-angular';
import { createAggregationForm } from '../../../../ui/aggregation-builder/aggregation-builder-forms';
import { GET_RESOURCES, GetResourcesQueryResponse } from '../graphql/queries';
import { Resource } from '../../../../../models/resource.model';

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

  // === RADIO ===
  public radioValue = false;

  // === DATA ===
  public resources: any[] = [];
  public resourcesQuery!: QueryRef<GetResourcesQueryResponse>;

  /** @returns the aggregation form */
  public get aggregationForm(): FormGroup {
    return createAggregationForm(null, '');
  }

  /**
   * SafeDataSourceTabComponent constructor
   *
   * @param apollo Used for getting the resources and layouts query
   */
  constructor(private apollo: Apollo) {}

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
    if (this.aggregationForm.value.dataSource) {
      variables.filter = {
        logic: 'and',
        filters: [
          {
            field: 'ids',
            operator: 'in',
            value: [this.aggregationForm.value.dataSource],
          },
        ],
      };
    }
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
}
