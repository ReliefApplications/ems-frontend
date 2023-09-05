import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  Renderer2,
} from '@angular/core';
import { QueryRef, Apollo } from 'apollo-angular';
import {
  GetRecordByIdQueryResponse,
  GetResourceRecordsQueryResponse,
  GET_RECORD_BY_ID,
  GET_RESOURCE_RECORDS,
} from './graphql/queries';
import { BehaviorSubject, Observable } from 'rxjs';
import { Record } from '../../models/record.model';
import { TranslateService } from '@ngx-translate/core';
import { SafeUnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';
import { updateQueryUniqueValues } from '../../utils/update-queries';
import { DOCUMENT } from '@angular/common';

/** A constant that is used to set the number of items to be displayed on the page. */
const ITEMS_PER_PAGE = 25;

/**
 * A component to display a dropdown to select a record
 */
@Component({
  selector: 'safe-record-dropdown',
  templateUrl: './record-dropdown.component.html',
  styleUrls: ['./record-dropdown.component.scss'],
})
export class SafeRecordDropdownComponent
  extends SafeUnsubscribeComponent
  implements OnInit, OnDestroy
{
  @Input() record = '';
  @Input() resourceId = '';
  @Input() field = '';
  @Input() placeholder = this.translate.instant(
    'components.record.dropdown.select'
  );
  @Input() filter: any = {};
  @Output() choice: EventEmitter<string> = new EventEmitter<string>();

  public selectedRecord: Record | null = null;
  private records = new BehaviorSubject<Record[]>([]);
  public records$!: Observable<Record[]>;
  private cachedRecords: Record[] = [];
  private recordsQuery!: QueryRef<GetResourceRecordsQueryResponse>;
  private pageInfo = {
    endCursor: '',
    hasNextPage: true,
  };
  private loading = true;
  private scrollListener!: any;

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created.
   *
   * @param apollo This is the Apollo service use to generate GraphQL queries
   * @param translate This is the service that we will use to translate the text in the platform
   * @param renderer Renderer2
   * @param document Document
   */
  constructor(
    private apollo: Apollo,
    private translate: TranslateService,
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.record) {
      this.apollo
        .query<GetRecordByIdQueryResponse>({
          query: GET_RECORD_BY_ID,
          variables: {
            id: this.record,
          },
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(({ data }) => {
          if (data.record) {
            this.selectedRecord = data.record;
          }
        });
    }

    if (this.resourceId) {
      this.recordsQuery =
        this.apollo.watchQuery<GetResourceRecordsQueryResponse>({
          query: GET_RESOURCE_RECORDS,
          variables: {
            id: this.resourceId,
            first: ITEMS_PER_PAGE,
            filter: this.filter,
          },
          fetchPolicy: 'no-cache',
          nextFetchPolicy: 'cache-first',
        });

      this.records$ = this.records.asObservable();
      this.recordsQuery.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe(({ data, loading }) => {
          this.updateValues(data, loading);
        });
    }
  }

  /**
   * Emits the selected resource id.
   *
   * @param e select event.
   */
  onSelect(e: any): void {
    this.choice.emit(e);
  }

  /**
   * Adds scroll listener to select.
   */
  onOpenSelect(): void {
    const panel = this.document.getElementById('optionList');
    if (panel) {
      if (this.scrollListener) {
        this.scrollListener();
      }
      this.scrollListener = this.renderer.listen(
        panel,
        'scroll',
        (event: any) => this.loadOnScroll(event)
      );
    }
  }

  /**
   * Fetches more items on scroll.
   *
   * @param e scroll event.
   */
  private loadOnScroll(e: any): void {
    if (
      e.target.scrollHeight - (e.target.clientHeight + e.target.scrollTop) <
      50
    ) {
      if (!this.loading && this.pageInfo?.hasNextPage && this.resourceId) {
        this.loading = true;
        this.recordsQuery
          .fetchMore({
            variables: {
              first: ITEMS_PER_PAGE,
              afterCursor: this.pageInfo.endCursor,
            },
          })
          .then((results) => this.updateValues(results.data, results.loading));
      }
    }
  }

  /**
   * Update record data value
   *
   * @param data query response data
   * @param loading loading status
   */
  private updateValues(
    data: GetResourceRecordsQueryResponse,
    loading: boolean
  ) {
    this.cachedRecords = updateQueryUniqueValues(
      this.cachedRecords,
      data.resource.records.edges.map((x) => x.node)
    );
    this.records.next(this.cachedRecords);
    this.pageInfo = data.resource.records.pageInfo;
    this.loading = loading;
  }

  override ngOnDestroy(): void {
    super.ngOnDestroy();
    if (this.scrollListener) {
      this.scrollListener();
    }
  }
}
