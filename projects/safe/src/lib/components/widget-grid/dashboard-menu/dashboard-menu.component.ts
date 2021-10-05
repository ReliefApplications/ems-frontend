import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { SafeGridService } from '../../../services/grid.service';
@Component({
  selector: 'safe-dashboard-menu',
  templateUrl: './dashboard-menu.component.html',
  styleUrls: ['./dashboard-menu.component.scss']
})
export class SafeDashboardMenuComponent implements OnInit {

  // === WIDGETS ===
  public items: any[] = [];
  
  // === EMIT THE WIDGET TO ADD ===
  @Output() add: EventEmitter<any> = new EventEmitter();

  constructor(
    private gridService: SafeGridService
  ) {}

  /*  Get the list of widgets.
  */
  ngOnInit(): void {
    this.items = this.gridService.availableTiles;
    console.log("this.items = ", this.items);
  }

  /*  Emit a widget.
  */
  onAdd(item: any): void {
    this.add.emit(item);
  }

}
