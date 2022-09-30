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
import { AggregationBuilderService } from '../../../../services/aggregation-builder.service';
import { SafeResourceGridModalComponent } from '../../../search-resource-grid-modal/search-resource-grid-modal.component';
import {
  GetRecordByIdQueryResponse,
  GetResourceLayoutsByIdQueryResponse,
  GET_RECORD_BY_ID,
  GET_RESOURCE_LAYOUTS,
} from '../graphql/queries';
import { clone, get } from 'lodash';
import {
  GetLayoutQueryResponse,
  GET_LAYOUT,
} from '../../summary-card-settings/card-modal/graphql/queries';
import { getFieldsValue } from '../parser/utils';

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

  @Input() headerTemplate?: TemplateRef<any>;

  /**
   * Single item component of summary card widget.
   *
   * @param apollo Apollo service
   * @param dialog Material dialog service
   * @param snackBar Shared snackBar service
   * @param translate Angular translate service
   * @param aggregationBuilder Aggregation builder service
   */
  constructor(
    private apollo: Apollo,
    private dialog: MatDialog,
    private snackBar: SafeSnackBarService,
    private translate: TranslateService,
    private aggregationBuilder: AggregationBuilderService
  ) {}

  ngOnInit(): void {
    this.setContent();
  }

  ngOnChanges() {
    this.setContent();
  }

  /** Sets the content of the card */
  private async setContent() {
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
            this.fieldsValue = getFieldsValue(res.data.record);
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
                  if (res2) {
                    this.styles = get(
                      res2.data.resource.layouts?.edges[0],
                      'node.query.style',
                      []
                    );
                    this.fields = [];
                    get(res.data.record, 'form.resource.metadata', []).map(
                      (metafield: any) => {
                        get(
                          res2.data.resource.layouts?.edges[0],
                          'node.query.fields',
                          []
                        ).map((field: any) => {
                          if (field.name === metafield.name) {
                            const type = metafield.type;
                            this.fields.push({ ...field, type });
                          }
                        });
                      }
                    );
                  } else {
                    this.fields = get(
                      res.data.record,
                      'form.resource.metadata',
                      []
                    );
                  }
                  this.loading = false;
                });
            } else if (typeof this.card.layout === 'object') {
              this.styles = get(this.card.layout, 'style', []);
              this.fields = [];
              get(res.data.record, 'form.resource.metadata', []).map(
                (metafield: any) => {
                  get(this.card.layout, 'fields', []).map((field: any) => {
                    if (field.name === metafield.name) {
                      const type = metafield.type;
                      this.fields.push({ ...field, type });
                    }
                  });
                }
              );
              this.loading = false;
            }
          } else {
            this.snackBar.openSnackBar(
              this.translate.instant(
                'components.widget.summaryCard.errors.invalidSource'
              ),
              { error: true }
            );
            this.loading = false;
          }
        });
    } else {
      this.loading = false;
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
