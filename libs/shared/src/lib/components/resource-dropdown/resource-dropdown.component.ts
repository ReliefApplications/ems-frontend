import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { Apollo, QueryRef } from 'apollo-angular';
import {
  Resource,
  ResourceQueryResponse,
  ResourcesQueryResponse,
} from '../../models/resource.model';
import { GET_RESOURCES, GET_SHORT_RESOURCE_BY_ID } from './graphql/queries';
import { UnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';

/** A constant that is used to determine how many items should be on one page. */
const ITEMS_PER_PAGE = 10;

/**
 * This component is used to create a dropdown where the user can select a resource.
 */
@Component({
  selector: 'shared-resource-dropdown',
  templateUrl: './resource-dropdown.component.html',
  styleUrls: ['./resource-dropdown.component.scss'],
})
export class ResourceDropdownComponent
  extends UnsubscribeComponent
  implements OnInit
{
  @Input() resource = '';
  public selectedResource?: Resource;
  @Output() choice: EventEmitter<string> = new EventEmitter<string>();
  public resourceControl!: UntypedFormControl;

  public resourcesQuery!: QueryRef<ResourcesQueryResponse>;

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created
   *
   * @param {Apollo} apollo - Apollo - This is the Apollo service that is used to create GraphQL queries.
   */
  constructor(private apollo: Apollo) {
    super();
  }

  ngOnInit(): void {
    this.resourceControl = new UntypedFormControl(this.resource);
    this.resourceControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.choice.emit(value);
      });
    if (this.resource) {
      this.apollo
        .query<ResourceQueryResponse>({
          query: GET_SHORT_RESOURCE_BY_ID,
          variables: {
            id: this.resource,
          },
        })
        .subscribe(({ data }) => {
          if (data.resource) {
            this.selectedResource = data.resource;
          }
        });
    }
    this.resourcesQuery = this.apollo.watchQuery<ResourcesQueryResponse>({
      query: GET_RESOURCES,
      variables: {
        first: ITEMS_PER_PAGE,
        sortField: 'name',
      },
    });
  }

  /**
   * Emits the selected resource id.
   *
   * @param e select event.
   */
  onSelect(e?: any): void {
    this.choice.emit(e);
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
