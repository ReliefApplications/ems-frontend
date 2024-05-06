import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  Optional,
  Renderer2,
  Self,
} from '@angular/core';
import {
  ButtonModule,
  GraphQLSelectComponent,
  SelectMenuModule,
  ShadowDomService,
  SpinnerModule,
  TooltipModule,
} from '@oort-front/ui';
import { FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  PeopleQueryResponse,
  getPersonLabel,
} from '../../../models/people.model';
import { Apollo, QueryRef } from 'apollo-angular';
import { GET_PEOPLE } from './graphql/queries';
import { takeUntil } from 'rxjs';
import { CompositeFilterDescriptor } from '@progress/kendo-data-query';
import { isArray } from 'lodash';

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
    SpinnerModule,
    ButtonModule,
    SelectMenuModule,
    TooltipModule,
  ],
  selector: 'shared-people-select',
  templateUrl:
    '../../../../../../ui/src/lib/graphql-select/graphql-select.component.html',
  styleUrls: [
    '../../../../../../ui/src/lib/graphql-select/graphql-select.component.scss',
  ],
})
export class PeopleSelectComponent
  extends GraphQLSelectComponent
  implements OnInit
{
  /** IDs of the initial people selection */
  @Input() initialSelectionIDs!: string[] | string;
  /** People query */
  public override query!: QueryRef<PeopleQueryResponse>;
  /** Store the previous search value */
  private previousSearchValue: string | null = null;
  /** search filters */
  private filters: any[] = [];
  /** number of items fetched after each query */
  private limitItems = 10;
  /** offset for the scroll loading */
  private offset = 0;
  /** boolean to control whether there are more people */
  private hasNextPage = true;

  /**
   * Component to pick people from the list of people
   *
   * @param ngControl form control shared service,
   * @param elementRef shared element ref service
   * @param renderer - Angular - Renderer2
   * @param changeDetectorRef - Angular - ChangeDetectorRef
   * @param shadowDomService shadow dom service to handle the current host of the component
   * @param apollo Apollo service
   */
  constructor(
    @Optional() @Self() public override ngControl: NgControl,
    public override elementRef: ElementRef<HTMLElement>,
    protected override renderer: Renderer2,
    protected override changeDetectorRef: ChangeDetectorRef,
    protected override shadowDomService: ShadowDomService,
    private apollo: Apollo
  ) {
    super(ngControl, elementRef, renderer, changeDetectorRef, shadowDomService);
    this.displayValueExpression = getPersonLabel;
    this.valueField = 'id';
    this.filterable = true;
    this.searchChange.pipe(takeUntil(this.destroy$)).subscribe((event) => {
      this.onSearchChange(event);
    });
    this.query = this.apollo.watchQuery<PeopleQueryResponse>({
      query: GET_PEOPLE,
    });
  }

  override ngOnInit(): void {
    super.ngOnInit();
    this.setupInitialSelection();
  }

  /** Fetches already selected people */
  private async setupInitialSelection() {
    if (!this.initialSelectionIDs || !this.initialSelectionIDs.length) {
      return;
    }
    this.loading = true;
    this.query
      .refetch({
        filter: {
          logic: 'or',
          filters: [
            {
              field: 'userid',
              operator: 'in',
              value: isArray(this.initialSelectionIDs)
                ? this.initialSelectionIDs
                : [this.initialSelectionIDs],
            },
          ],
        } as CompositeFilterDescriptor,
      })
      .then(({ data }) => {
        if (data.people) {
          this.selectedElements = data.people;
        }
      });
  }

  /**
   * Load more items on scroll.
   *
   * @param e scroll event
   */
  protected override loadOnScroll(e: any): void {
    if (
      e.target.scrollHeight - (e.target.clientHeight + e.target.scrollTop) <
        50 &&
      !this.loading &&
      this.hasNextPage
    ) {
      this.offset += 10;
      this.loading = true;
      this.query
        .fetchMore({
          variables: {
            filter: {
              logic: 'or',
              filters: this.filters,
            } as CompositeFilterDescriptor,
            limitItems: this.limitItems,
            offset: this.offset,
          },
        })
        .then((results) => {
          this.updateValues(results.data, results.loading);
          this.hasNextPage = results.data.people.length === this.limitItems;
        });
    }
  }

  /**
   * Handles the search events
   *
   * @param searchValue New search value
   */
  public onSearchChange(searchValue: string) {
    if (searchValue.length >= 2 && searchValue !== this.previousSearchValue) {
      this.offset = 0;
      this.hasNextPage = true;
      const searchWords = searchValue
        .split(' ')
        .filter((word) => word.length >= 3);

      const filters = [
        {
          field: 'userid',
          operator: 'in',
          value: isArray(this.value) ? this.value : [this.value],
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
      this.filters = filters;
      this.query
        .refetch({
          filter: {
            logic: 'or',
            filters: filters,
          } as CompositeFilterDescriptor,
          limitItems: this.limitItems,
        })
        .then((results) => {
          this.hasNextPage = results.data.people.length === this.limitItems;
        });
      this.previousSearchValue = searchValue;
    }
  }
}
