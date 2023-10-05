import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { get } from 'lodash';
import { CardT } from '../summary-card.component';
import { Dialog } from '@angular/cdk/dialog';
import { takeUntil } from 'rxjs/operators';
import { SummaryCardFormT } from '../../summary-card-settings/summary-card-settings.component';
import { UnsubscribeComponent } from '../../../utils/unsubscribe/unsubscribe.component';

/**
 * Single Item component of Summary card widget.
 */
@Component({
  selector: 'shared-summary-card-item',
  templateUrl: './summary-card-item.component.html',
  styleUrls: ['./summary-card-item.component.scss'],
})
export class SummaryCardItemComponent
  extends UnsubscribeComponent
  implements OnInit, OnChanges
{
  @Input() card!: CardT;
  @Input() settings: SummaryCardFormT | any = {};
  public fields: any[] = [];
  public fieldsValue: any = null;
  public styles: any[] = [];

  /**
   * Summary card item component
   *
   * @param dialog Dialog service
   */
  constructor(public dialog: Dialog) {
    super();
  }

  ngOnInit(): void {
    this.setContent();
  }

  ngOnChanges() {
    this.setContent();
  }

  /** Sets the content of the card */
  private async setContent() {
    this.fields = this.card.metadata || [];
    if (!this.card.resource) return;
    if (this.card.aggregation) {
      this.fieldsValue = this.card.cardAggregationData;
      this.setContentFromAggregation();
    } else this.setContentFromLayout();
  }

  /**
   * Set content of the card item, querying associated record.
   */
  private async setContentFromLayout(): Promise<void> {
    await this.getStyles();
    this.fieldsValue = { ...this.card.record };
    this.fields = this.card.metadata || [];
  }

  /** Sets layout style */
  private async getStyles(): Promise<void> {
    // this.layout = this.card.layout;
    this.styles = get(this.card.layout, 'query.style', []);
    // this.styles = get(this.card, 'meta.style', []);
  }

  /**
   * Queries the data for each of the static cards.
   */
  // private async getCardData() {
  //   // gets metadata
  //   const metaRes = await firstValueFrom(
  //     this.apollo.query<GetResourceMetadataQueryResponse>({
  //       query: GET_RESOURCE_METADATA,
  //       variables: {
  //         id: this.card.resource,
  //       },
  //     })
  //   );
  //   const queryName = get(metaRes, 'data.resource.queryName');

  //   const builtQuery = this.queryBuilder.buildQuery({
  //     query: this.layout.query,
  //   });
  //   const layoutFields = this.layout.query.fields;
  //   this.fields = get(metaRes, 'data.resource.metadata', []).map((f: any) => {
  //     const layoutField = layoutFields.find((lf: any) => lf.name === f.name);
  //     if (layoutField) {
  //       return { ...layoutField, ...f };
  //     }
  //     return f;
  //   });
  //   if (builtQuery) {
  //     this.apollo
  //       .query<any>({
  //         query: builtQuery,
  //         variables: {
  //           first: 1,
  //           filter: {
  //             // get only the record we need
  //             logic: 'and',
  //             filters: [
  //               {
  //                 field: 'id',
  //                 operator: 'eq',
  //                 value: this.card.record,
  //               },
  //             ],
  //           },
  //         },
  //       })
  //       .subscribe((res) => {
  //         const record: any = get(res.data, `${queryName}.edges[0].node`, null);
  //         this.fieldsValue = { ...record };
  //       });
  //   }
  // }

  /**
   * Set content of the card item from aggregation data.
   */
  private setContentFromAggregation(): void {
    this.styles = [];
    if (!this.fieldsValue) return;
    // @TODO: get the fields' types from the aggregation data
    this.fields = Object.keys(this.fieldsValue).map((key) => ({
      name: key,
      editor: 'text',
    }));
  }

  /**
   * Opens the form corresponding to selected summary card in order to update it
   */
  public async updateSummaryCard(): Promise<void> {
    const { FormModalComponent } = await import(
      '../../../../components/form-modal/form-modal.component'
    );
    const dialogRef = this.dialog.open(FormModalComponent, {
      disableClose: true,
      data: {
        recordId: this.card.record?.id,
        template: this.settings.template || null,
      },
      autoFocus: false,
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        /** Save new modifiedAt */
        const modifiedAt = value.data['modifiedAt'];
        const date = new Date(parseInt(modifiedAt));
        const isoDateString = date.toISOString();

        const keys = Object.keys(value.data.data);
        const cardRecord = { ...this.card.record } as any;
        const valueData = { ...value.data.data } as any;
        /** Save new fields modified */
        for (const key of keys) {
          cardRecord[key] = valueData[key];
        }
        cardRecord['modifiedAt'] = isoDateString;
        this.card.record = cardRecord;
        this.setContent();
      }
    });
  }
}
