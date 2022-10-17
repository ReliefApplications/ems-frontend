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
import { SafeSnackBarService } from '../../../../services/snackbar/snackbar.service';
import { AggregationBuilderService } from '../../../../services/aggregation-builder/aggregation-builder.service';
import { SafeResourceGridModalComponent } from '../../../search-resource-grid-modal/search-resource-grid-modal.component';
import {
  GetResourceMetadataQueryResponse,
  GET_RESOURCE_METADATA,
} from '../graphql/queries';
import { clone, get } from 'lodash';
import {
  GetLayoutQueryResponse,
  GET_LAYOUT,
} from '../../summary-card-settings/card-modal/graphql/queries';
import { QueryBuilderService } from '../../../../services/query-builder/query-builder.service';

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
  public fieldsValue: any = null;
  public loading = true;
  public styles: any[] = [];

  private layout: any;

  @Input() headerTemplate?: TemplateRef<any>;

  /**
   * Single item component of summary card widget.
   *
   * @param apollo Apollo service
   * @param dialog Material dialog service
   * @param snackBar Shared snackBar service
   * @param translate Angular translate service
   * @param aggregationBuilder Aggregation builder service
   * @param queryBuilder Query builder service
   */
  constructor(
    private apollo: Apollo,
    private dialog: MatDialog,
    private snackBar: SafeSnackBarService,
    private translate: TranslateService,
    private aggregationBuilder: AggregationBuilderService,
    private queryBuilder: QueryBuilderService
  ) {}

  ngOnInit(): void {
    this.setContent();
  }

  ngOnChanges() {
    this.setContent();
  }

  /** Sets the content of the card */
  private async setContent() {
    this.fields = this.card.metadata;
    if (this.card.isAggregation) {
      this.fieldsValue = this.card.cardAggregationData;
      if (!this.card.isDynamic) await this.getAggregationData();
      this.setContentFromAggregation();
    } else this.setContentFromLayout();
  }

  /** Get the aggregation data for the current card, if not dynamic. */
  private async getAggregationData() {
    const res = await this.aggregationBuilder
      .buildAggregation(this.card.resource, this.card.aggregation)
      ?.toPromise();

    // for static cards with aggregation, assume the response is an array with one element
    if (res?.data?.recordsAggregation)
      this.fieldsValue = res.data.recordsAggregation[0];
  }

  /**
   * Set content of the card item, querying associated record.
   */
  private setContentFromLayout(): void {
    this.getStyles();
    if (typeof this.card.record === 'string') {
      this.getCardData();
    } else if (typeof this.card.record === 'object') {
      this.fieldsValue = { ...this.card.record };
      this.fields = this.card.metadata;
      this.loading = false;
    } else {
      this.snackBar.openSnackBar(
        this.translate.instant(
          'components.widget.summaryCard.errors.invalidSource'
        ),
        { error: true }
      );
      this.loading = false;
    }
  }

  /** Sets layout style */
  private getStyles() {
    if (typeof this.card.layout === 'string') {
      this.apollo
        .query<GetLayoutQueryResponse>({
          query: GET_LAYOUT,
          variables: {
            id: this.card.layout,
            resource: this.card.resource,
          },
        })
        .subscribe((res2) => {
          if (res2.data) {
            this.layout = res2.data.resource.layouts?.edges[0]?.node;
            this.styles = get(
              res2.data.resource.layouts?.edges[0],
              'node.query.style',
              []
            );
          }
          this.loading = false;
        });
    } else if (typeof this.card.layout === 'object') {
      this.layout = this.card.layout;
      this.styles = get(this.card.layout, 'style', []);
      this.loading = false;
    }
  }

  /**
   * Queries the data for each of the static cards.
   */
  private async getCardData() {
    // gets metadata
    const metaRes = await this.apollo
      .query<GetResourceMetadataQueryResponse>({
        query: GET_RESOURCE_METADATA,
        variables: {
          id: this.card.resource,
        },
      })
      .toPromise();
    const queryName = get(metaRes, 'data.resource.queryName');

    const builtQuery = this.queryBuilder.buildQuery({
      query: this.layout.query,
    });
    const layoutFields = this.layout.query.fields;
    this.fields = get(metaRes, 'data.resource.metadata').map((f: any) => {
      const layoutField = layoutFields.find((lf: any) => lf.name === f.name);
      if (layoutField) {
        return { ...layoutField, ...f };
      }
      return f;
    });
    this.apollo
      .query<any>({
        query: builtQuery,
        variables: {
          first: 1,
          filter: {
            // get only the record we need
            logic: 'and',
            filters: [
              {
                field: 'id',
                operator: 'eq',
                value: this.card.record,
              },
            ],
          },
        },
      })
      .subscribe((res) => {
        const record: any = get(res.data, `${queryName}.edges[0].node`, null);
        this.fieldsValue = { ...record };
      });
  }

  /**
   * Set content of the card item from aggregation data.
   */
  private setContentFromAggregation(): void {
    this.styles = [];
    this.loading = false;
    if (!this.fieldsValue) return;
    // @TODO: get the fields' types from the aggregation data
    this.fields = Object.keys(this.fieldsValue).map((key) => ({
      name: key,
      editor: 'text',
    }));
  }

  /**
   * Open the dataSource modal.
   */
  public openDataSource(): void {
    if (this.layout?.query) {
      this.dialog.open(SafeResourceGridModalComponent, {
        data: {
          gridSettings: clone(this.layout.query),
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
  }
}
