import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { GraphQLSelectModule } from '@oort-front/ui';
import { UnsubscribeComponent } from '../../../components/utils/unsubscribe/unsubscribe.component';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  PeopleQueryResponse,
  Person,
  getPersonLabel,
} from '../../../models/people.model';
import { Apollo, QueryRef } from 'apollo-angular';
import { GET_PEOPLE } from './graphql/queries';
import { takeUntil } from 'rxjs';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';

/**
 * Component to pick people from the list of people
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
  selector: 'shared-people-dropdown',
  templateUrl: './people-dropdown.component.html',
  styleUrls: ['./people-dropdown.component.scss'],
})
export class PeopleDropdownComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Applications to get people from, if any */
  @Input() applications?: string[];
  /** IDs of the initial people selection */
  @Input() initialSelectionIDs: string[] = [];
  /** Selection change emitter */
  @Output() selectionChange = new EventEmitter<string[]>();
  /** Initial selection of people */
  public initialSelection: Person[] = [];
  /** People query */
  public query!: QueryRef<PeopleQueryResponse>;
  /** Form control that has selected people */
  public control = new FormControl<string[]>([]);
  /** Store the timeout ID returned by setTimeout */
  private searchTimeout: ReturnType<typeof setTimeout> | null = null;
  /** Store the previous search value */
  private previousSearchValue: string | null = null;
  /** Display value expression used by the select */
  public displayValueExpression = getPersonLabel;

  /**
   * Component to pick people from the list of people
   *
   * @param apollo Apollo client
   */
  constructor(private apollo: Apollo) {
    super();
  }

  ngOnInit(): void {
    this.setupInitialSelection();

    this.query = this.apollo.watchQuery<PeopleQueryResponse>({
      query: GET_PEOPLE,
    });

    this.control.valueChanges?.subscribe(() => {
      this.selectionChange.emit(this.control.value ?? []);
    });
  }

  /** Fetches already selected people */
  private async setupInitialSelection() {
    if (!this.initialSelectionIDs.length) {
      return;
    }

    // Sets the form value
    this.control.setValue(this.initialSelectionIDs);

    this.apollo
      .query<PeopleQueryResponse>({
        query: GET_PEOPLE,
        variables: {
          filter: {
            logic: 'or',
            filters: [
              {
                field: 'userid',
                operator: 'in',
                value: this.initialSelectionIDs,
              },
            ],
          } as CompositeFilterDescriptor,
        },
      })
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ data }) => {
        if (data.people) {
          this.initialSelection = data.people;
        }
      });
  }

  /**
   * Handles the search events
   *
   * @param searchValue New search value
   */
  public onSearchChange(searchValue: string) {
    // Clear previous timeout if it exists
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    if (searchValue.length >= 2 && searchValue !== this.previousSearchValue) {
      const searchWords = searchValue
        .split(' ')
        .filter((word) => word.length >= 3);

      const filters = [
        {
          field: 'userid',
          operator: 'in',
          value: this.control.value,
        },
        {
          field: 'lastname',
          operator: 'like',
          value: searchValue,
        },
        {
          field: 'firstname',
          operator: 'like',
          value: searchValue,
        },
      ];

      if (searchWords.length > 1) {
        for (let index = 0; index < 2; index++) {
          ['lastname', 'firstname', 'emailaddress'].forEach((field) => {
            filters.push({
              field: field,
              operator: 'like',
              value: searchWords[index],
            });
          });
        }
      } else {
        filters.push({
          field: 'emailaddress',
          operator: 'like',
          value: searchValue,
        });
      }

      this.searchTimeout = setTimeout(() => {
        this.query.refetch({
          filter: {
            logic: 'or',
            filters: filters,
          } as CompositeFilterDescriptor,
        });
      }, 500);

      this.previousSearchValue = searchValue;
    }
  }
}
