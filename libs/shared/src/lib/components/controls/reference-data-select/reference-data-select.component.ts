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
import { TranslateModule } from '@ngx-translate/core';
import { GET_REFERENCE_DATAS } from './graphql/queries';
import { ReferenceDatasQueryResponse } from '../../../models/reference-data.model';

/** Default items per query, for pagination */
const ITEMS_PER_PAGE = 10;

/**
 * Shared reference data select component.
 * Extends graphql select component.
 */
@Component({
  selector: 'shared-reference-data-select',
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
      useExisting: forwardRef(() => ReferenceDataSelectComponent),
    },
  ],
})
export class ReferenceDataSelectComponent extends GraphQLSelectComponent {
  /**
   * Shared reference data select component.
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
    this.query = this.apollo.watchQuery<ReferenceDatasQueryResponse>({
      query: GET_REFERENCE_DATAS,
      variables: {
        first: ITEMS_PER_PAGE,
        sortField: 'name',
      },
    });
    this.valueField = 'id';
    this.textField = 'name';
    this.filterable = true;
    this.searchChange.subscribe((value) => {
      this.onSearchChange(value);
    });
  }

  /**
   * Changes the query according to search text
   *
   * @param search Search text from the graphql select
   */
  public onSearchChange(search: string): void {
    const variables = this.query.variables;
    this.query.refetch({
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
