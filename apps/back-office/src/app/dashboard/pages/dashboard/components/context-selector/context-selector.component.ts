import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  AlertModule,
  ButtonModule,
  FormWrapperModule,
  GraphQLSelectModule,
  SelectMenuModule,
  TooltipModule,
} from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import {
  PageContextT,
  ResourceRecordsNodesQueryResponse,
  Record,
  ReferenceDataService,
} from '@oort-front/shared';
import { Apollo, QueryRef } from 'apollo-angular';
import { GET_RESOURCE_RECORDS } from '../../graphql/queries';

/** Default number of records fetched per page */
const ITEMS_PER_PAGE = 10;

/**
 * Dashboard context selector.
 */
@Component({
  selector: 'app-context-selector',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AlertModule,
    TranslateModule,
    GraphQLSelectModule,
    FormWrapperModule,
    SelectMenuModule,
    ButtonModule,
    TooltipModule,
  ],
  templateUrl: './context-selector.component.html',
  styleUrls: ['./context-selector.component.scss'],
})
export class ContextSelectorComponent implements OnInit {
  /** Dashboard context */
  @Input() context!: PageContextT;
  /** Contextual record */
  @Input() contextRecord: Record | null = null;
  /** Contextual template id */
  @Input() contextId!: FormControl<string | number | null>;
  /** Is record using default template */
  @Input() defaultTemplate?: boolean;
  /** Contextual records query */
  public recordsQuery!: QueryRef<ResourceRecordsNodesQueryResponse>;
  /** Field of contextual reference data */
  public refDataValueField = '';
  /** Contextual reference data elements  */
  public refDataElements: any[] = [];

  /**
   * Dashboard context selector.
   *
   * @param apollo Apollo service
   * @param refDataService Shared reference data service
   */
  constructor(
    private apollo: Apollo,
    private refDataService: ReferenceDataService
  ) {}

  ngOnInit(): void {
    this.updateContextOptions();
  }

  /**
   * Update query based on text search.
   *
   * @param search Search text from the graphql select
   */
  public onSearchChange(search: string): void {
    if ('resource' in this.context) {
      this.recordsQuery.refetch({
        variables: {
          first: ITEMS_PER_PAGE,
          id: this.context.resource,
        },
        filter: {
          logic: 'and',
          filters: [
            {
              field: this.context.displayField,
              operator: 'contains',
              value: search,
            },
          ],
        },
      });
    }
  }

  /**
   * Update the context options.
   * Loads elements from reference data or records from resource.
   */
  private updateContextOptions() {
    if ('resource' in this.context) {
      this.recordsQuery =
        this.apollo.watchQuery<ResourceRecordsNodesQueryResponse>({
          query: GET_RESOURCE_RECORDS,
          variables: {
            first: ITEMS_PER_PAGE,
            id: this.context.resource,
          },
        });
    }

    if ('refData' in this.context) {
      this.refDataService
        .loadReferenceData(this.context.refData)
        .then((refData) => {
          this.refDataValueField = refData.valueField || '';
          this.refDataService.fetchItems(refData).then(({ items }) => {
            this.refDataElements = items;
          });
        });
    }
  }
}
