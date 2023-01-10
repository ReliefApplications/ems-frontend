import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Apollo, QueryRef } from 'apollo-angular';
import { Resource } from '../../models/resource.model';
import {
  GetResourceByIdQueryResponse,
  GetResourcesQueryResponse,
  GET_RESOURCES,
  GET_SHORT_RESOURCE_BY_ID,
} from './graphql/queries';
import { SafeUnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';

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
export class SafeResourceDropdownComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  @Input() resource = '';
  public selectedResource?: Resource;
  @Output() choice: EventEmitter<string> = new EventEmitter<string>();
  public resourceControl!: FormControl;

  public resourcesQuery!: QueryRef<GetResourcesQueryResponse>;

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
    this.resourceControl = new FormControl(this.resource);
    this.resourceControl.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.choice.emit(value);
      });
    if (this.resource) {
      this.apollo
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
}
