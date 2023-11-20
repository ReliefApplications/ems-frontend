import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { get } from 'lodash';
import { CardT } from '../summary-card.component';

/**
 * Single Item component of Summary card widget.
 */
@Component({
  selector: 'shared-summary-card-item',
  templateUrl: './summary-card-item.component.html',
  styleUrls: ['./summary-card-item.component.scss'],
})
export class SummaryCardItemComponent implements OnInit, OnChanges {
  /** Card configuration */
  @Input() card!: CardT;
  /** Available fields */
  public fields: any[] = [];
  /** Mapping fields / values */
  public fieldsValue: any = null;
  /** Loaded styles */
  public styles: any[] = [];

  /** @returns should widget use padding, based on widget settings */
  get usePadding() {
    return get(this.card, 'usePadding') ?? true;
  }

  ngOnInit(): void {
    this.checkEditRecordButtonContent();
    this.setContent();
  }

  /**
   * Check if there is an edit record button set in the widget content and updates it's access accordingly
   */
  private checkEditRecordButtonContent() {
    const editRecordTest = new RegExp(/<button id="record-editor"/gim);
    const editRecordIsHidden = new RegExp(
      /style="border: 0px; padding: 0px; visibility: hidden"/gim
    );
    // If edit record button is set for this widget, but current user it's not allowed to edit, hide it
    if (editRecordTest.test(this.card.html ?? '')) {
      if (!this.card.record?.canUpdate) {
        if (!editRecordIsHidden.test(this.card.html ?? '')) {
          this.card.html = (this.card.html as string).replace(
            'style="border: 0px; padding: 0px;"',
            'style="border: 0px; padding: 0px; visibility: hidden"'
          );
        }
      } else {
        if (editRecordIsHidden.test(this.card.html ?? '')) {
          this.card.html = (this.card.html as string).replace(
            'style="border: 0px; padding: 0px; visibility: hidden"',
            'style="border: 0px; padding: 0px;"'
          );
        }
      }
    }
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
}
