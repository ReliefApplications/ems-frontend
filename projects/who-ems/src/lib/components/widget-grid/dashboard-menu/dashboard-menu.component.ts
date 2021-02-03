import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {WhoGridService} from '../../../services/grid.service';

@Component({
  selector: 'who-dashboard-menu',
  templateUrl: './dashboard-menu.component.html',
  styleUrls: ['./dashboard-menu.component.scss']
})
export class WhoDashboardMenuComponent implements OnInit {

  // === WIDGETS ===
  public items: any[];

  // === EMIT THE WIDGET TO ADD ===
  @Output() add: EventEmitter<any> = new EventEmitter();

  constructor(
    private gridService: WhoGridService
  ) { }

  /*  Get the list of widgets.
  */
  ngOnInit(): void {
    this.items = this.gridService.availableTiles;
  }

  /*  Emit a widget.
  */
  onAdd(item: any): void {
    this.add.emit(item);
  }

}
