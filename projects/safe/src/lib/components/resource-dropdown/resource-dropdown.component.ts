import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { Resource } from '../../models/resource.model';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  MAT_SELECT_SCROLL_STRATEGY,
  MatSelect,
} from '@angular/material/select';
import {
  GetResourceByIdQueryResponse,
  GetResourcesQueryResponse,
  GET_RESOURCES,
  GET_SHORT_RESOURCE_BY_ID,
} from './graphql/queries';
import { BlockScrollStrategy, Overlay } from '@angular/cdk/overlay';

/** A constant that is used to determine how many items should be on one page. */
const ITEMS_PER_PAGE = 10;

/**
 * Scroll Factory for material select, provided by the component.
 *
 * @param overlay material overlay
 * @returns Strategy to prevent scrolling if user sees overlay.
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function scrollFactory(overlay: Overlay): () => BlockScrollStrategy {
  const block = () => overlay.scrollStrategies.block();
  return block;
}

/**
 * This component is used to create a dropdown where the user can select a resource.
 */
@Component({
  selector: 'safe-resource-dropdown',
  templateUrl: './resource-dropdown.component.html',
  styleUrls: ['./resource-dropdown.component.scss'],
  providers: [
    {
      provide: MAT_SELECT_SCROLL_STRATEGY,
      useFactory: scrollFactory,
      deps: [Overlay],
    },
  ],
})
export class SafeResourceDropdownComponent implements OnInit {
  @Input() resource = '';
  @Output() choice: EventEmitter<string> = new EventEmitter<string>();

  public resourcesQuery!: QueryRef<GetResourcesQueryResponse>;

  @ViewChild('resourceSelect') resourceSelect?: MatSelect;

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created
   *
   * @param {Apollo} apollo - Apollo - This is the Apollo service that is used to create GraphQL queries.
   */
  constructor(private apollo: Apollo) {}

  ngOnInit(): void {
    this.resourcesQuery = this.apollo.watchQuery<GetResourcesQueryResponse>({
      query: GET_RESOURCES,
      variables: {
        first: ITEMS_PER_PAGE,
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
}
