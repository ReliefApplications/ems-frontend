import {
  Component,
  Input,
  OnChanges,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';
import { SafeSnackBarService } from '../../../../services/snackbar/snackbar.service';
import {
  GetResourceMetadataQueryResponse,
  GET_RESOURCE_METADATA,
  GetLayoutQueryResponse,
  GET_LAYOUT,
} from '../graphql/queries';
import { get } from 'lodash';
import { QueryBuilderService } from '../../../../services/query-builder/query-builder.service';
import { firstValueFrom } from 'rxjs';
import { CardT } from '../summary-card.component';

/**
 * Single Item component of Summary card widget.
 */
@Component({
  selector: 'safe-summary-card-item',
  templateUrl: './summary-card-item.component.html',
  styleUrls: ['./summary-card-item.component.scss'],
})
export class SummaryCardItemComponent implements OnInit, OnChanges {
  @Input() card!: CardT;
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
   * @param snackBar Shared snackBar service
   * @param translate Angular translate service
   * @param queryBuilder Query builder service
   */
  constructor(
    private apollo: Apollo,
    private snackBar: SafeSnackBarService,
    private translate: TranslateService,
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
    if (typeof this.card.record === 'string') {
      this.getCardData();
    } else if (typeof this.card.record === 'object') {
      this.fieldsValue = { ...this.card.record };
      this.fields = this.card.metadata || [];
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
  private async getStyles(): Promise<void> {
    if (typeof this.card.layout === 'string') {
      const apolloRes = await firstValueFrom(
        this.apollo.query<GetLayoutQueryResponse>({
          query: GET_LAYOUT,
          variables: {
            id: this.card.layout,
            resource: this.card.resource,
          },
        })
      );
      if (get(apolloRes, 'data')) {
        this.layout = apolloRes.data.resource.layouts?.edges[0].node;
        this.styles = this.layout?.query.style;
      }
    } else if (typeof this.card.layout === 'object') {
      this.layout = this.card.layout;
      this.styles = get(this.card.layout, 'query.style', []);
    }
    this.loading = false;
  }

  /**
   * Queries the data for each of the static cards.
   */
  private async getCardData() {
    // gets metadata
    const metaRes = await firstValueFrom(
      this.apollo.query<GetResourceMetadataQueryResponse>({
        query: GET_RESOURCE_METADATA,
        variables: {
          id: this.card.resource,
        },
      })
    );
    const queryName = get(metaRes, 'data.resource.queryName');

    const builtQuery = this.queryBuilder.buildQuery({
      query: this.layout.query,
    });
    const layoutFields = this.layout.query.fields;
    this.fields = get(metaRes, 'data.resource.metadata', []).map((f: any) => {
      const layoutField = layoutFields.find((lf: any) => lf.name === f.name);
      if (layoutField) {
        return { ...layoutField, ...f };
      }
      return f;
    });
    if (builtQuery) {
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
}
