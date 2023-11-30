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
    this.setContent();
  }

  ngOnChanges() {
    this.setContent();
  }

  /** Sets the content of the card */
  private async setContent() {
    this.fields = this.card.metadata || [];
    // No datasource
    if (!this.card.resource && !this.card.referenceData) return;
    if (this.card.resource) {
      // Using resource
      if (this.card.layout) {
        this.setContentFromLayout();
      } else {
        this.fieldsValue = this.card.rawValue;
        this.setContentFromAggregation();
      }
    } else {
      // Using reference data
      this.fieldsValue = this.card.rawValue;
      this.setContentFromAggregation();
    }
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
    this.styles = get(this.card.layout, 'query.style', []);
  }

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
