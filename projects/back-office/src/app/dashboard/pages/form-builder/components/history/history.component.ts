import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

/**
 * Form history component.
 */
@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss'],
})
export class HistoryComponent implements OnInit {
  // === DATA ===
  @Input() dataSource: any[] = [];
  displayedColumns: string[] = ['id', 'createdAt'];

  // === EMIT THE SELECTED FORM VERSION ===
  // eslint-disable-next-line @angular-eslint/no-output-native
  @Output() open: EventEmitter<any> = new EventEmitter();

  /**
   * Form history component
   */
  constructor() {}

  ngOnInit(): void {}

  /**
   * Open selected version
   *
   * @param version version to display
   */
  openVersion(version: any): void {
    this.open.emit(version);
  }
}
