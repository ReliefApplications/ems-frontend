import { Component, Input, OnInit } from '@angular/core';
import { GridDataResult } from '@progress/kendo-angular-grid';

@Component({
  selector: 'safe-grid',
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss']
})
export class SafeGridComponent implements OnInit {

  // === DATA ===
  @Input() fields: any[] = [];
  @Input() data: GridDataResult = { data: [], total: 0 };
  @Input() loading = false;

  constructor() { }

  ngOnInit(): void {
  }

  // === UTILITIES ===
  /**
   * Checks if element overflows
   * @param e Component resizing event.
   * @returns True if overflows.
   */
   isEllipsisActive(e: any): boolean {
    return (e.offsetWidth < e.scrollWidth);
  }

  /**
   * Expands text in a full window modal.
   * @param item Item to display data of.
   * @param rowTitle field name.
   */
  public onExpandText(item: any, field: any): void {
    console.log('on expand');
  }
}
