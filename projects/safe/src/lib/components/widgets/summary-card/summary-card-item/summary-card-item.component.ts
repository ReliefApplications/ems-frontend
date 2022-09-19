import {
  Component,
  Input,
  OnChanges,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { SafeSnackBarService } from '../../../../services/snackbar.service';
import { SafeResourceGridModalComponent } from '../../../search-resource-grid-modal/search-resource-grid-modal.component';
import {
  GetRecordByIdQueryResponse,
  GetResourceLayoutsByIdQueryResponse,
  GET_RECORD_BY_ID,
  GET_RESOURCE_LAYOUTS,
} from '../graphql/queries';
import { Record } from '../../../../models/record.model';
import { clone, get } from 'lodash';

/**
 * Single Item component of Summary card widget.
 */
@Component({
  selector: 'safe-summary-card-item',
  templateUrl: './summary-card-item.component.html',
  styleUrls: ['./summary-card-item.component.scss'],
})
export class SummaryCardItemComponent implements OnInit, OnChanges {
  @Input() card!: any;
  public fields: any[] = [];
  public record: Record | null = null;
  public loading = true;

  /**
   * Gets the aggregation data for the current card
   *
   * @returns The aggregation data
   */
  public get cardAggregationData() {
    return this.card.cardAggregationData;
  }

  @Input() headerTemplate?: TemplateRef<any>;

  /**
   * Single item component of summary card widget.
   *
   * @param apollo Apollo service
   * @param dialog Material dialog service
   * @param snackBar Shared snackBar service
   * @param translate Angular translate service
   */
  constructor(
    private apollo: Apollo,
    private dialog: MatDialog,
    private snackBar: SafeSnackBarService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.setContent();
  }

  ngOnChanges() {
    this.setContent();
  }

  /** Sets the content of the card */
  private setContent() {
    if (this.card.isAggregation) this.setContentFromAggregation();
    else this.setContentFromLayout();
  }

  /**
   * Set content of the card item, querying associated record.
   */
  private setContentFromLayout(): void {
    if (this.card.record) {
      this.apollo
        .query<GetRecordByIdQueryResponse>({
          query: GET_RECORD_BY_ID,
          variables: {
            id: this.card.record,
            display: true,
          },
        })
        .subscribe((res) => {
          if (res.data.record) {
            this.record = res.data.record;
            this.fields = get(res.data.record, 'form.resource.metadata', []);
          } else {
            this.snackBar.openSnackBar(
              this.translate.instant(
                'components.widget.summaryCard.errors.invalidSource'
              ),
              { error: true }
            );
          }
          this.loading = false;
        });
    } else {
      this.loading = false;
    }
  }

  /**
   * Set content of the card item from aggregation data.
   */
  private setContentFromAggregation(): void {
    this.loading = false;
    if (!this.cardAggregationData) return;
    // @TODO: get the fields' types from the aggregation data
    this.fields = Object.keys(this.cardAggregationData).map((key) => ({
      name: key,
      editor: 'text',
    }));
  }

  /**
   * Open the dataSource modal.
   */
  public openDataSource(): void {
    this.apollo
      .query<GetResourceLayoutsByIdQueryResponse>({
        query: GET_RESOURCE_LAYOUTS,
        variables: {
          id: this.card.resource,
        },
      })
      .subscribe((res) => {
        const layouts = res.data?.resource?.layouts || [];
        const query = layouts.find((l) => l.id === this.card.layout)?.query;
        if (query) {
          this.dialog.open(SafeResourceGridModalComponent, {
            data: {
              gridSettings: clone(query),
            },
          });
        } else {
          this.snackBar.openSnackBar(
            this.translate.instant(
              'components.widget.summaryCard.errors.invalidSource'
            ),
            { error: true }
          );
        }
      });
  }
}
