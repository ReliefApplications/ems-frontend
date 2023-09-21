import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Apollo, QueryRef } from 'apollo-angular';
import {
  ReferenceData,
  ReferenceDataQueryResponse,
  ReferenceDatasQueryResponse,
} from '../../models/reference-data.model';
import {
  GET_REFERENCE_DATAS,
  GET_SHORT_REFERENCE_DATA_BY_ID,
} from './graphql/queries';
import { UnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { takeUntil } from 'rxjs/operators';
import { FormControl } from '@angular/forms';

/** Pagination */
const ITEMS_PER_PAGE = 10;

/**
 * Reference data dropdown component.
 */
@Component({
  selector: 'shared-reference-data-dropdown',
  templateUrl: './reference-data-dropdown.component.html',
  styleUrls: ['./reference-data-dropdown.component.scss'],
})
export class ReferenceDataDropdownComponent
  extends UnsubscribeComponent
  implements OnInit, OnDestroy
{
  public control = new FormControl<string | null>(null);
  @Input() referenceData = '';
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() change: EventEmitter<string> = new EventEmitter<string>();

  public selectedReferenceData: ReferenceData | null = null;
  public referenceDatasQuery!: QueryRef<ReferenceDatasQueryResponse>;

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
        .query<ReferenceDataQueryResponse>({
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
      this.apollo.watchQuery<ReferenceDatasQueryResponse>({
        query: GET_REFERENCE_DATAS,
        variables: {
          first: ITEMS_PER_PAGE,
        },
      });
  }
}
