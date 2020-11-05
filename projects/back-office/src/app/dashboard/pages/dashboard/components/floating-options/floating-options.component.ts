import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TileDisplayComponent } from './menu/tile-display/tile-display.component';
import { TileDataComponent } from './menu/tile-data/tile-data.component';
import { WhoGridService } from 'who-shared';

@Component({
  selector: 'app-floating-options',
  templateUrl: './floating-options.component.html',
  styleUrls: ['./floating-options.component.scss']
})
/*  Button on top left of each widget, if user can see it, with menu of possible actions for that widget.
*/
export class FloatingOptionsComponent implements OnInit {

  // === WIDGET ===
  @Input() tile: any;

  // === EMIT ACTION SELECTED ===
  @Output() edit: EventEmitter<any> = new EventEmitter();
  @Output() delete: EventEmitter<any> = new EventEmitter();

  // === AVAILABLE ACTIONS ===
  public items: any[];

  constructor(
    public dialog: MatDialog,
    private gridService: WhoGridService
  ) { }

  /*  Set the list of available actions.
  */
  ngOnInit(): void {
    this.items = [
      {
        name: 'Display',
        icon: 'settings'
      },
      {
        name: 'Settings',
        icon: 'insert_chart',
        disabled: !this.tile || !this.tile.settings
      },
      {
        name: 'Delete',
        icon: 'delete'
      }
    ];
  }

  /*  Open a modal, or emit an event depending on the action clicked.
  */
  onClick(item: any): void {
    if (item.name === 'Display') {
      const dialogRef = this.dialog.open(TileDisplayComponent, {
        data: {
          tile: this.tile
        }
      });
      dialogRef.afterClosed().subscribe(res => {
        this.edit.emit({ type: 'display', id: this.tile.id, options: res});
      });
    }
    if (item.name === 'Settings') {
      const dialogRef = this.dialog.open(TileDataComponent, {
        data: {
          tile: this.tile,
          template: this.gridService.findSettingsTemplate(this.tile)
        },
        panelClass: 'tile-settings-dialog'
      });
      dialogRef.afterClosed().subscribe(res => {
        this.edit.emit({ type: 'data', id: this.tile.id, options: res });
      });
    }
    if (item.name === 'Delete') {
      this.delete.emit({id: this.tile.id});
    }
  }
}
