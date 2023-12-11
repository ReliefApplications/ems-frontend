import { Component, Input, OnInit } from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CardT } from '../../widgets/summary-card/summary-card.component';
import { PageChangeEvent } from '@progress/kendo-angular-pager';

/**
 * Shared reference data grid component.
 */
@Component({
  selector: 'shared-reference-data-grid',
  templateUrl: './reference-data-grid.component.html',
  styleUrls: ['./reference-data-grid.component.scss'],
})
export class ReferenceDataGridComponent implements OnInit {
  /** Grid settings */
  @Input() settings: any = null;
  /** Data for the grid */
  public gridData: GridDataResult = { data: [], total: 0 };
  /** Available cards */
  public cards: CardT[] = [];
  /** Fields for the grid */
  public fields: any[] = [];
  /** Pagination: page size */
  public pageSize = 10;
  /** Pagination: skip number */
  public skip = 0;
  /** If the grid settings are loading */
  public loadingSettings = true;
  /** If the grid records are loading */
  public loadingRecords = true;
  /** Data for the gridData */
  private data: any[] = [];

  ngOnInit(): void {
    if (this.settings && this.settings.refDataCards) {
      this.cards = this.settings.refDataCards;
      //  Get fields
      this.settings.refDataCards[0].metadata.forEach((field: any) =>
        this.fields.push({
          // Remove white spaces to avoid kendo warnings
          name: field.name.replace(/\s/g, ''),
          title: field.name,
          type: field.type,
          meta: {
            type: this.getMetaTypeFromJson(field.type),
          },
          disabled: true,
          hidden: false,
          canSee: true,
        })
      );
      this.setGridData();
      this.loadingSettings = false;
    }
  }

  /**
   * Get meta type for grid based on json type
   *
   * @param type json type
   * @returns meta type
   */
  private getMetaTypeFromJson(type: string): string {
    switch (type) {
      case 'string':
        return 'text';
      case 'integer':
      case 'number':
        return 'numeric';
      case 'boolean':
        return 'boolean';
      default:
        return type;
    }
  }

  /**
   * Set grid data with the cards values
   */
  private setGridData(): void {
    this.data = this.cards.map((card: CardT) => {
      const rawValue = card.rawValue;
      const values: any = {};
      for (const key in rawValue) {
        values[key.replace(/\s/g, '')] = rawValue[key];
      }
      const cardData = {
        ...values,
        ...{ text: values },
      };
      return cardData;
    });
    this.gridData = {
      data: this.data.slice(0, this.pageSize),
      total: this.cards.length,
    };
    this.loadingRecords = false;
  }

  /**
   * Detects pagination events and update the items loaded.
   *
   * @param event Page change event.
   */
  public onPageChange(event: PageChangeEvent): void {
    this.skip = event.skip;
    this.pageSize = event.take;
    const startIndex = event.skip;
    const endIndex = startIndex + event.take;
    this.gridData = {
      data: this.data.slice(startIndex, endIndex),
      total: this.data.length,
    };
  }
}
