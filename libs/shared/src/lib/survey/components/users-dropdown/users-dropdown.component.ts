import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { GraphQLSelectModule, SelectMenuComponent } from '@oort-front/ui';
import { UnsubscribeComponent } from '../../../components/utils/unsubscribe/unsubscribe.component';
import {
  User,
  UserQueryResponse,
  UsersNodeQueryResponse,
} from '../../../models/user.model';
import { GET_USERS, GET_USER_BY_ID } from './graphql/queries';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';

/** Default page size */
const ITEMS_PER_PAGE = 10;

/**
 * Component to pick users from the list of users
 * Can be searched by email, is filtered by applications and is paginated
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    GraphQLSelectModule,
  ],
  selector: 'shared-users-dropdown',
  templateUrl: './users-dropdown.component.html',
  styleUrls: ['./users-dropdown.component.scss'],
})
export class UsersDropdownComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Form that has selected users */
  public form = new FormControl<string[]>([]);
  /** Applications to get users from, if any */
  @Input() applications?: string[];
  /** IDs of the initial user selection */
  @Input() initialSelectionIDs: string[] = [];
  /** Initial selection of users */
  public initialSelection: User[] = [];
  /** Users query */
  public query!: QueryRef<UsersNodeQueryResponse>;
  /** Selection change emitter */
  @Output() selectionChange = new EventEmitter<string[]>();

  /**
   * Select menu component
   */
  @ViewChild(SelectMenuComponent, { static: true })
  selectMenu!: SelectMenuComponent;

  /**
   * Component to pick users from the list of users
   * Can be searched by email, is filtered by applications and is paginated
   *
   * @param apollo Apollo client
   */
  constructor(private apollo: Apollo) {
    super();
  }

  ngOnInit(): void {
    this.setupInitialSelection();
    this.query = this.apollo.watchQuery<UsersNodeQueryResponse>({
      query: GET_USERS,
      variables: {
        first: ITEMS_PER_PAGE,
        applications: this.applications ?? null,
      },
    });

    this.form.valueChanges?.subscribe(() => {
      this.selectionChange.emit(this.form.value ?? []);
    });
  }

  /** Fetches already selected users */
  private async setupInitialSelection() {
    if (!this.initialSelectionIDs.length) {
      return;
    }

    // Sets the form value
    this.form.setValue(this.initialSelectionIDs);

    // Not the most efficient way to do this, but it works
    // Maybe we should add a query to get multiple users by ID
    const res = this.initialSelectionIDs.map((id) => {
      return firstValueFrom(
        this.apollo.query<UserQueryResponse>({
          query: GET_USER_BY_ID,
          variables: {
            id,
          },
        })
      );
    });

    // Array of user objects to be used as initial selection
    this.initialSelection = (await Promise.all(res)).map(
      (res) => res?.data?.user
    );
  }

  /**
   * Handles the search events
   *
   * @param searchValue New search value
   */
  public onSearchChange(searchValue: string) {
    this.query.refetch({
      filter: {
        logic: 'and',
        filters: [
          {
            field: 'username',
            operator: 'contains',
            value: searchValue,
          },
        ],
      } as CompositeFilterDescriptor,
    });
  }
}
