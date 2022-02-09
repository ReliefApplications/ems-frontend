import { BlockScrollStrategy, Overlay } from '@angular/cdk/overlay';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  MAT_SELECT_SCROLL_STRATEGY,
  MatSelect,
} from '@angular/material/select';
import { QueryRef, Apollo } from 'apollo-angular';
import {
  GetRecordByIdQueryResponse,
  GetResourceRecordsQueryResponse,
  GET_RECORD_BY_ID,
  GET_RESOURCE_RECORDS,
} from '../../graphql/queries';
import { BehaviorSubject, Observable } from 'rxjs';
import { Record } from '../../models/record.model';
import { TranslateService } from '@ngx-translate/core';

const ITEMS_PER_PAGE = 25;

// eslint-disable-next-line prefer-arrow/prefer-arrow-functions
export function scrollFactory(overlay: Overlay): () => BlockScrollStrategy {
  const block = () => overlay.scrollStrategies.block();
  return block;
}

@Component({
  selector: 'safe-record-dropdown',
  templateUrl: './record-dropdown.component.html',
  styleUrls: ['./record-dropdown.component.scss'],
  providers: [
    {
      provide: MAT_SELECT_SCROLL_STRATEGY,
      useFactory: scrollFactory,
      deps: [Overlay],
    },
  ],
})
export class SafeRecordDropdownComponent implements OnInit {
  @Input() record = '';
  @Input() resourceId = '';
  @Input() field = '';
  @Input() placeholder = this.translate.instant('record.placeholder');
  @Input() filter: any = {};
  @Output() choice: EventEmitter<string> = new EventEmitter<string>();

  public selectedRecord: Record | null = null;
  private records = new BehaviorSubject<Record[]>([]);
  public records$!: Observable<Record[]>;
  private recordsQuery!: QueryRef<GetResourceRecordsQueryResponse>;
  private pageInfo = {
    endCursor: '',
    hasNextPage: true,
  };
  private loading = true;

  @ViewChild('recordSelect') recordSelect?: MatSelect;

  constructor(private apollo: Apollo, private translate: TranslateService) {}

  ngOnInit(): void {
    if (this.record) {
      this.apollo
        .query<GetRecordByIdQueryResponse>({
          query: GET_RECORD_BY_ID,
          variables: {
            id: this.record,
          },
        })
        .subscribe((res) => {
          if (res.data.record) {
            this.selectedRecord = res.data.record;
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
        });

      this.records$ = this.records.asObservable();
      this.recordsQuery.valueChanges.subscribe((res) => {
        this.records.next(res.data.resource.records.edges.map((x) => x.node));
        this.pageInfo = res.data.resource.records.pageInfo;
        this.loading = res.loading;
      });
    }
  }

  /**
   * Emits the selected resource id.
   *
   * @param e select event.
   */
  onSelect(e: any): void {
    this.choice.emit(e.value);
  }

  /**
   * Adds scroll listener to select.
   *
   * @param e open select event.
   */
  onOpenSelect(e: any): void {
    if (e && this.recordSelect) {
      const panel = this.recordSelect.panel.nativeElement;
      panel.addEventListener('scroll', (event: any) =>
        this.loadOnScroll(event)
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
      if (!this.loading && this.pageInfo.hasNextPage && this.resourceId) {
        this.loading = true;
        this.recordsQuery.fetchMore({
          variables: {
            id: this.resourceId,
            first: ITEMS_PER_PAGE,
            afterCursor: this.pageInfo.endCursor,
            filter: this.filter,
          },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) {
              return prev;
            }
            if (this.selectedRecord) {
              if (
                fetchMoreResult.resource.records.edges.find(
                  (x) => x.node.id === this.selectedRecord?.id
                )
              ) {
                this.selectedRecord = null;
              }
            }
            return Object.assign({}, prev, {
              resource: {
                records: {
                  edges: [
                    ...prev.resource.records.edges,
                    ...fetchMoreResult.resource.records.edges,
                  ],
                  pageInfo: fetchMoreResult.resource.records.pageInfo,
                },
              },
            });
          },
        });
      }
    }
  }
}
