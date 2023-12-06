import { Component, Input, OnInit } from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';
import { CardT } from '../../widgets/summary-card/summary-card.component';
import { cloneDeep } from 'lodash';

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

  ngOnInit(): void {
    if (this.settings && this.settings.refDataCards) {
      this.cards = this.settings.refDataCards;
      this.setGridData();

      // Get fields with reference data service
    }
  }

  /**
   * Set grid data with the cards values
   */
  private setGridData(): void {
    // const data = this.cards.map((card) => {});
    this.gridData = {
      data: cloneDeep(this.cards), // update to use cards rawValue
      total: this.cards.length,
    };
  }
}
