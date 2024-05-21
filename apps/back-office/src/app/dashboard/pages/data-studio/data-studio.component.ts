import { Component, OnInit } from '@angular/core';
import {
  UnsubscribeComponent,
  Form,
  FormsQueryResponse,
} from '@oort-front/shared';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Apollo, QueryRef } from 'apollo-angular';
import { GET_FORM_NAMES } from './graphql/queries';
import { FormBuilder } from '@angular/forms';

/** Items per page */
const ITEMS_PER_PAGE = 10;

/**
 * Data Studio component
 */
@Component({
  selector: 'app-data-studio',
  templateUrl: './data-studio.component.html',
  styleUrls: ['./data-studio.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
/** Data studio component class */
export class DataStudioComponent
  extends UnsubscribeComponent
  implements OnInit
{
  /** Single form */
  public formId = '';

  /** Form handling */
  public formsQuery!: QueryRef<FormsQueryResponse>;
  /** Cached forms */
  public cachedForms: Form[] = [];
  /** Selected form */
  public selectedForm = this.fb.group({
    form: [''],
  });

  /**
   * Data studio component constructor
   *
   * @param apollo Apollo client service
   * @param fb FormBuilder service
   */
  constructor(private apollo: Apollo, private fb: FormBuilder) {
    super();
  }

  /** OnInit Hook. */
  ngOnInit(): void {
    this.formsQuery = this.apollo.watchQuery<FormsQueryResponse>({
      query: GET_FORM_NAMES,
      variables: {
        first: ITEMS_PER_PAGE,
        sortField: 'name',
      },
    });
  }

  /**
   * Update query based on text search.
   *
   * @param search Search text from the graphql select
   */
  onSearchChange(search: string): void {
    const variables = this.formsQuery.variables;
    this.formsQuery.refetch({
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

  /**
   * Form selection change handler
   *
   * @param event Event object
   */
  onSelectionChange(event: any): void {
    this.formId = event;
  }
}
