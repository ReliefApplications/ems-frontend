import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { Subscription } from 'rxjs';
import { Resource } from '../../models/resource.model';
import {
  GetResourceByIdQueryResponse,
  GetResourcesQueryResponse,
  GET_RESOURCES,
  GET_SHORT_RESOURCE_BY_ID,
} from './graphql/queries';

/** A constant that is used to determine how many items should be on one page. */
const ITEMS_PER_PAGE = 10;

/**
 * This component is used to create a dropdown where the user can select a resource.
 */
@Component({
  selector: 'safe-resource-dropdown',
  templateUrl: './resource-dropdown.component.html',
  styleUrls: ['./resource-dropdown.component.scss'],
})
export class SafeResourceDropdownComponent implements OnInit, OnDestroy {
  @Input() resource = '';
  public selectedResource?: Resource;
  @Output() choice: EventEmitter<string> = new EventEmitter<string>();

  public resourcesQuery!: QueryRef<GetResourcesQueryResponse>;

  private querySubscription?: Subscription;

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created
   *
   * @param {Apollo} apollo - Apollo - This is the Apollo service that is used to create GraphQL queries.
   */
  constructor(private apollo: Apollo) {}

  ngOnInit(): void {
    if (this.resource) {
      this.querySubscription = this.apollo
        .query<GetResourceByIdQueryResponse>({
          query: GET_SHORT_RESOURCE_BY_ID,
          variables: {
            id: this.resource,
          },
        })
        .subscribe((res) => {
          if (res.data.resource) {
            this.selectedResource = res.data.resource;
          }
        });
    }
    this.resourcesQuery = this.apollo.watchQuery<GetResourcesQueryResponse>({
      query: GET_RESOURCES,
      variables: {
        first: ITEMS_PER_PAGE,
        sortField: 'name',
      },
    });
  }

  ngOnDestroy(): void {
    if (this.querySubscription) {
      this.querySubscription.unsubscribe();
    }
  }

  /**
   * Emits the selected resource id.
   *
   * @param e select event.
   */
  onSelect(e?: any): void {
    this.choice.emit(e);
  }
}
