import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Apollo, QueryRef } from 'apollo-angular';
import {
  GetResourceQueryResponse,
  GetResourcesQueryResponse,
  GET_RESOURCE,
  GET_RESOURCES,
} from '../graphql/queries';
import { Resource } from '../../../../models/resource.model';
import { SafeUnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';
import { GraphQLSelectComponent } from '@oort-front/ui';

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
export class MapGeneralComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  @Input() form!: UntypedFormGroup;
  // === RESOURCE SELECTION ===
  public resourcesQuery!: QueryRef<GetResourcesQueryResponse>;
  public resource?: Resource;

  /** Reference to graphql select for layout */
  @ViewChild(GraphQLSelectComponent)
  resourceSelect?: GraphQLSelectComponent;

  /**
   * General settings of the map widget:
   * - title
   * - resource
   * - query
   *
   * @param apollo Apollo service
   */
  constructor(private apollo: Apollo) {
    super();
  }

  ngOnInit(): void {
    this.resourcesQuery = this.apollo.watchQuery<GetResourcesQueryResponse>({
      query: GET_RESOURCES,
      variables: {
        first: ITEMS_PER_PAGE,
        sortField: 'name',
      },
    });

    if (this.form.value.resource) {
      this.getResource(this.form.value.resource);
    }

    this.form
      .get('resource')
      ?.valueChanges.pipe(takeUntil(this.destroy$)) // Ensure that the queries won't be resent when closing / reopening the tab
      .subscribe((value: string) => {
        this.getResource(value);
      });
  }

  /**
   * Get resource by id
   *
   * @param id resource id
   */
  private getResource(id: string): void {
    this.apollo
      .query<GetResourceQueryResponse>({
        query: GET_RESOURCE,
        variables: {
          id,
        },
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ data }) => {
        this.resource = data.resource;
      });
  }
}
