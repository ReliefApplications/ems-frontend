import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  // === DATA ===
  @Input() dataSource: any[] = [];
  displayedColumns: string[] = ['id', 'createdAt'];

  // === EMIT THE SELECTED FORM VERSION ===
  // tslint:disable-next-line: no-output-native
  @Output() open: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit(): void {}

    /*  Emit a version.
  */
 openVersion(version: any): void {
  this.open.emit(version);
}

}
