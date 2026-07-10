import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
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
  QueryBuilderService,
  QueryResponse,
  Record,
  ReferenceDataService,
  ResourceQueryResponse,
  UnsubscribeComponent,
} from '@oort-front/shared';
import { Apollo, QueryRef } from 'apollo-angular';
import { takeUntil } from 'rxjs';
import { GET_RESOURCE_QUERY_NAME } from '../../graphql/queries';
import get from 'lodash/get';

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
export class ContextSelectorComponent
  extends UnsubscribeComponent
  implements OnInit, OnChanges
{
  /** Dashboard context */
  @Input() context!: PageContextT;
  /** Contextual record */
  @Input() contextRecord: Record | null = null;
  /** Contextual template id */
  @Input() contextId!: FormControl<string | number | null>;
  /** Is record using default template */
  @Input() defaultTemplate?: boolean;
  /** Contextual records query */
  public recordsQuery!: QueryRef<QueryResponse>;
  /** Contextual record, as returned by the built query, so it always appears in the select */
  public selectedRecordElements: any[] = [];
  /** Dynamically built records query document */
  private builtQuery: ReturnType<QueryBuilderService['buildQuery']> = null;
  /** Field of contextual reference data */
  public refDataValueField = '';
  /** Contextual reference data choices  */
  public refDataChoices: { text: unknown; value: unknown }[] = [];

  /**
   * Dashboard context selector.
   *
   * @param apollo Apollo service
   * @param queryBuilder Shared query builder service
   * @param refDataService Shared reference data service
   */
  constructor(
    private apollo: Apollo,
    private queryBuilder: QueryBuilderService,
    private refDataService: ReferenceDataService
  ) {
    super();
  }

  ngOnInit(): void {
    this.updateContextOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['contextRecord']) {
      this.updateSelectedElements();
    }
    if (changes['context']) {
      this.updateContextOptions();
    }
  }

  /**
   * Update query based on text search.
   *
   * @param search Search text from the graphql select
   */
  public onSearchChange(search: string): void {
    if ('resource' in this.context && this.recordsQuery) {
      this.recordsQuery.refetch({
        first: ITEMS_PER_PAGE,
        skip: 0,
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
      this.apollo
        .query<ResourceQueryResponse>({
          query: GET_RESOURCE_QUERY_NAME,
          variables: {
            id: this.context.resource,
          },
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(({ data }) => {
          if (data.resource?.queryName) {
            this.buildRecordsQuery(data.resource.queryName);
          }
        });
    }

    if ('refData' in this.context) {
      this.refDataService
        .loadReferenceData(this.context.refData as string)
        .then((refData) => {
          this.refDataValueField = refData.valueField || '';
          this.refDataService.fetchItems(refData).then(({ items }) => {
            this.refDataChoices = items.map((x) => ({
              value: get(x, this.refDataValueField),
              text: get(x, this.context.displayField),
            }));
          });
        });
    }
  }

  /**
   * Builds the records query from a dynamically built layout, restricted to the context display field.
   *
   * @param queryName Query name of the contextual resource
   */
  private buildRecordsQuery(queryName: string): void {
    this.builtQuery = this.queryBuilder.buildQuery({
      query: {
        name: queryName,
        fields: [{ kind: 'SCALAR', name: this.context.displayField }],
      },
    });
    if (this.builtQuery) {
      this.recordsQuery = this.apollo.watchQuery<QueryResponse>({
        query: this.builtQuery,
        variables: {
          first: ITEMS_PER_PAGE,
        },
      });
      this.updateSelectedElements();
    }
  }

  /**
   * Updates the selected elements of the select.
   * As the selected record may not be part of the first page of the records query,
   * fetches it separately, using the same built query, filtered on its id.
   */
  private updateSelectedElements(): void {
    if (!this.contextRecord) {
      this.selectedRecordElements = [];
      return;
    }
    // Only provide elements fetched with the built query, so their shape
    // matches the select options ( e.g. calculated fields are resolved )
    if (this.builtQuery) {
      this.apollo
        .query<QueryResponse>({
          query: this.builtQuery,
          variables: {
            first: 1,
            filter: {
              logic: 'and',
              filters: [
                {
                  field: 'ids',
                  operator: 'eq',
                  value: [this.contextRecord.id],
                },
              ],
            },
          },
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(({ data }) => {
          const node = get(Object.values(data)[0], 'edges[0].node');
          if (node) {
            this.selectedRecordElements = [node];
          }
        });
    }
  }
}
