import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import { ReferenceData } from '../../models/reference-data.model';
import {
  GetReferenceDataByIdQueryResponse,
  GetReferenceDatasQueryResponse,
  GET_REFERENCE_DATAS,
  GET_SHORT_REFERENCE_DATA_BY_ID,
} from './graphql/queries';
import { SafeUnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

/** Pagination */
const ITEMS_PER_PAGE = 10;

/**
 * Reference data dropdown component.
 */
@Component({
  selector: 'safe-reference-data-dropdown',
  templateUrl: './reference-data-dropdown.component.html',
  styleUrls: ['./reference-data-dropdown.component.scss'],
})
export class SafeReferenceDataDropdownComponent
  extends SafeUnsubscribeComponent
  implements OnInit, OnDestroy
{
  public control = new FormControl<string | null>(null);
  @Input() referenceData = '';
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() change: EventEmitter<string> = new EventEmitter<string>();

  public selectedReferenceData: ReferenceData | null = null;
  public referenceDatasQuery!: QueryRef<GetReferenceDatasQueryResponse>;

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
          this.selectedReferenceData = data.referenceData;
          this.control.setValue(this.referenceData, { emitEvent: false });
        });
    }

    this.referenceDatasQuery =
      this.apollo.watchQuery<GetReferenceDatasQueryResponse>({
        query: GET_REFERENCE_DATAS,
        variables: {
          first: ITEMS_PER_PAGE,
        },
      });
  }
}
