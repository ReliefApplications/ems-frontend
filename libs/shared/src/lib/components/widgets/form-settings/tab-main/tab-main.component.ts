import { Component, Input, OnInit } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { Apollo, QueryRef } from 'apollo-angular';
import { GET_FORMS } from '../graphql/queries';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';
import { Form, FormsQueryResponse } from '../../../../models/form.model';
import { DashboardService } from '../../../../services/dashboard/dashboard.service';
import { map } from 'rxjs';

/** Number of items per page */
const ITEMS_PER_PAGE = 10;

/**
 * Main tab of form widget settings modal.
 */
@Component({
  selector: 'shared-tab-main',
  templateUrl: './tab-main.component.html',
  styleUrls: ['./tab-main.component.scss'],
})
export class TabMainComponent extends UnsubscribeComponent implements OnInit {
  /** Widget form group */
  @Input() formGroup!: UntypedFormGroup;
  /** Selected form */
  @Input() form: Form | null = null;
  /** Forms query */
  public formsQuery!: QueryRef<FormsQueryResponse>;
  /** Dashboard states options */
  public dashboardStates = this.dashboardService.states$.pipe(
    map((states) =>
      states.map((state) => ({
        label: state.name,
        value: state.id,
      }))
    )
  );

  /**
   * Main tab of form widget settings modal.
   *
   * @param apollo Apollo service
   * @param dashboardService Dashboard service
   */
  constructor(
    private apollo: Apollo,
    private dashboardService: DashboardService
  ) {
    super();
  }

  ngOnInit(): void {
    this.formsQuery = this.apollo.watchQuery<FormsQueryResponse>({
      query: GET_FORMS,
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
}
