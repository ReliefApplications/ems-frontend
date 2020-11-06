import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { WhoGridService } from '@who-ems';

@Component({
  selector: 'app-floating-menu',
  templateUrl: './floating-menu.component.html',
  styleUrls: ['./floating-menu.component.scss']
})
/*  Floating button that displays a list of all available widgets, defined by the grid service.
*/
export class FloatingMenuComponent implements OnInit {

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
