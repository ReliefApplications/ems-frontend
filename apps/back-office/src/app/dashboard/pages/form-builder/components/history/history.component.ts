import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Form history component.
 */
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent {
  // === DATA ===
  /** Data source */
  @Input() dataSource: any[] = [];
  /** Displayed columns */
  displayedColumns: string[] = ['id', 'createdAt'];

  // === EMIT THE SELECTED FORM VERSION ===
  /** Open event */
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() open: EventEmitter<any> = new EventEmitter();

  /**
   * Open selected version
   *
   * @param version version to display
   */
  openVersion(version: any): void {
    this.open.emit(version);
  }
}
