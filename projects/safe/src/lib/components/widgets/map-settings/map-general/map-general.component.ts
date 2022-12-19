import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Apollo, QueryRef } from 'apollo-angular';
import { GetResourcesQueryResponse, GET_RESOURCES } from '../graphql/queries';
import { Resource } from '../../../../models/resource.model';
import { SafeGraphQLSelectComponent } from '../../../graphql-select/graphql-select.component';

/** Default items per query, for pagination */
const ITEMS_PER_PAGE = 10;

/**
 * General settings of the map widget:
 * - title
 * - query
 */
@Component({
  selector: 'safe-map-general',
  templateUrl: './map-general.component.html',
  styleUrls: ['./map-general.component.scss'],
})
export class MapGeneralComponent implements OnInit {
  @Input() form!: FormGroup;
  // === RESOURCE SELECTION ===
  public resourcesQuery!: QueryRef<GetResourcesQueryResponse>;
  public resource?: Resource;

  /** Reference to graphql select for layout */
  @ViewChild(SafeGraphQLSelectComponent)
  resourceSelect?: SafeGraphQLSelectComponent;

  /**
   * General settings of the map widget:
   * - title
   * - resource
   * - query
   *
   * @param apollo Apollo service
   */
  constructor(private apollo: Apollo) {}

  ngOnInit(): void {
    this.resourcesQuery = this.apollo.watchQuery<GetResourcesQueryResponse>({
      query: GET_RESOURCES,
      variables: {
        first: ITEMS_PER_PAGE,
        sortField: 'name',
      },
    });

    this.form.get('resource')?.valueChanges.subscribe((resource: Resource) => {
      this.resource = this.resourceSelect?.elements
        .getValue()
        .find((x) => x.id === resource);
    });
  }
}
