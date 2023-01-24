import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { ReferenceData } from '../../models/reference-data.model';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  MAT_LEGACY_SELECT_SCROLL_STRATEGY as MAT_SELECT_SCROLL_STRATEGY,
  MatLegacySelect as MatSelect,
} from '@angular/material/legacy-select';
import {
  GetReferenceDataByIdQueryResponse,
  GetReferenceDatasQueryResponse,
  GET_REFERENCE_DATAS,
  GET_SHORT_REFERENCE_DATA_BY_ID,
} from './graphql/queries';
import { Overlay } from '@angular/cdk/overlay';
import { scrollFactory } from '../../utils/scroll-factory';
import { SafeUnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';

/** Pagination */
const ITEMS_PER_PAGE = 10;

/**
 * Reference data dropdown component.
 */
@Component({
  selector: 'safe-reference-data-dropdown',
  templateUrl: './reference-data-dropdown.component.html',
  styleUrls: ['./reference-data-dropdown.component.scss'],
  providers: [
    {
      provide: MAT_SELECT_SCROLL_STRATEGY,
      useFactory: scrollFactory,
      deps: [Overlay],
    },
  ],
})
export class SafeReferenceDataDropdownComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  @Input() referenceData = '';
  @Output() choice: EventEmitter<string> = new EventEmitter<string>();

  public selectedReferenceData: ReferenceData | null = null;
  private referenceDatas = new BehaviorSubject<ReferenceData[]>([]);
  public referenceDatas$!: Observable<ReferenceData[]>;
  private referenceDatasQuery!: QueryRef<GetReferenceDatasQueryResponse>;
  private pageInfo = {
    endCursor: '',
    hasNextPage: true,
  };
  private loading = true;

  @ViewChild('referenceDataSelect') referenceDataSelect?: MatSelect;

  /**
   * Reference data dropdown component
   *
   * @param apollo Apollo service
   */
  constructor(private apollo: Apollo) {
    super();
  }

  ngOnInit(): void {
    if (this.referenceData) {
      this.apollo
        .query<GetReferenceDataByIdQueryResponse>({
          query: GET_SHORT_REFERENCE_DATA_BY_ID,
          variables: {
            id: this.referenceData,
          },
        })
        .pipe(takeUntil(this.destroy$))
        .subscribe(({ data }) => {
          if (
            data.referenceData &&
            !this.referenceDatas.value.find((x) => x.id === this.referenceData)
          ) {
            this.selectedReferenceData = data.referenceData;
          }
        });
    }

    this.referenceDatasQuery =
      this.apollo.watchQuery<GetReferenceDatasQueryResponse>({
        query: GET_REFERENCE_DATAS,
        variables: {
          first: ITEMS_PER_PAGE,
        },
      });

    this.referenceDatas$ = this.referenceDatas.asObservable();
    this.referenceDatasQuery.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ data, loading }) => {
        const referenceDatas = data.referenceDatas.edges.map((x) => x.node);
        this.referenceDatas.next(referenceDatas);
        if (referenceDatas.find((x) => x.id === this.referenceData)) {
          this.selectedReferenceData = null;
        }
        this.pageInfo = data.referenceDatas.pageInfo;
        this.loading = loading;
      });
  }

  /**
   * Emits the selected referenceData id.
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
    if (e && this.referenceDataSelect) {
      const panel = this.referenceDataSelect.panel.nativeElement;
      panel.addEventListener('scroll', (event: any) =>
        this.loadOnScroll(event)
      );
    }
  }

  /**
   * Fetches more referenceDatas on scroll.
   *
   * @param e scroll event.
   */
  private loadOnScroll(e: any): void {
    if (
      e.target.scrollHeight - (e.target.clientHeight + e.target.scrollTop) <
      50
    ) {
      if (!this.loading && this.pageInfo.hasNextPage) {
        this.loading = true;
        this.referenceDatasQuery.fetchMore({
          variables: {
            first: ITEMS_PER_PAGE,
            afterCursor: this.pageInfo.endCursor,
          },
          // updateQuery: (prev, { fetchMoreResult }) => {
          //   if (!fetchMoreResult) {
          //     return prev;
          //   }
          //   if (this.selectedReferenceData) {
          //     if (
          //       fetchMoreResult.referenceDatas.edges.find(
          //         (x) => x.node.id === this.selectedReferenceData?.id
          //       )
          //     ) {
          //       this.selectedReferenceData = null;
          //     }
          //   }
          //   return Object.assign({}, prev, {
          //     referenceDatas: {
          //       edges: [
          //         ...prev.referenceDatas.edges,
          //         ...fetchMoreResult.referenceDatas.edges,
          //       ],
          //       pageInfo: fetchMoreResult.referenceDatas.pageInfo,
          //       totalCount: fetchMoreResult.referenceDatas.totalCount,
          //     },
          //   });
          // },
        });
      }
    }
  }
}
