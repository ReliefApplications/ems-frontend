import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Optional,
  Renderer2,
  Self,
  forwardRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ButtonModule,
  GraphQLSelectComponent,
  SelectMenuModule,
  ShadowDomService,
  SpinnerModule,
  TooltipModule,
} from '@oort-front/ui';
import { FormsModule, NgControl, ReactiveFormsModule } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import { ResourcesQueryResponse } from '../../../models/resource.model';
import { GET_RESOURCES } from './graphql/queries';
import { TranslateModule } from '@ngx-translate/core';
import { takeUntil } from 'rxjs';

/** Default items per query, for pagination */
const ITEMS_PER_PAGE = 10;

/**
 * Shared resource select component.
 * Extends graphql select component.
 */
@Component({
  selector: 'shared-resource-select',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    SpinnerModule,
    ButtonModule,
    SelectMenuModule,
    TooltipModule,
  ],
  templateUrl:
    '../../../../../../ui/src/lib/graphql-select/graphql-select.component.html',
  styleUrls: [
    '../../../../../../ui/src/lib/graphql-select/graphql-select.component.scss',
  ],
  providers: [
    {
      provide: GraphQLSelectComponent,
      useExisting: forwardRef(() => ResourceSelectComponent),
    },
  ],
})
export class ResourceSelectComponent extends GraphQLSelectComponent {
  /**
   * Shared resource select component.
   * Extends graphql select component.
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

    this.valueField = 'id';
    this.textField = 'name';
    this.filterable = true;
    this.searchChange.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      this.onSearchChange(value);
    });
  }

  /**
   * Override GraphQLSelectComponent onOpenSelect to only load query when
   * select menu is open for the first time.
   *
   */
  public override onOpenSelect(): void {
    if (!this.query) {
      this.query = this.apollo.watchQuery<ResourcesQueryResponse>({
        query: GET_RESOURCES,
        variables: {
          first: ITEMS_PER_PAGE,
          sortField: 'name',
        },
      });

      this.query.valueChanges
        .pipe(takeUntil(this.queryChange$), takeUntil(this.destroy$))
        .subscribe({
          next: ({ data, loading }) => {
            this.queryName = Object.keys(data)[0];
            this.updateValues(data, loading);
          },
          error: () => {
            this.loading = false;
          },
        });
    }
    super.onOpenSelect();
  }

  /**
   * Changes the query according to search text
   *
   * @param search Search text from the graphql select
   */
  public onSearchChange(search: string): void {
    const variables = this.query.variables;
    this.query?.refetch({
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
