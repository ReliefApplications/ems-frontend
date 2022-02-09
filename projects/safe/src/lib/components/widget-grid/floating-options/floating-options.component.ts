import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SafeTileDisplayComponent } from './menu/tile-display/tile-display.component';
import { SafeTileDataComponent } from './menu/tile-data/tile-data.component';
import { SafeDashboardService } from '../../../services/dashboard.service';
import { SafeConfirmModalComponent } from '../../confirm-modal/confirm-modal.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'safe-floating-options',
  templateUrl: './floating-options.component.html',
  styleUrls: ['./floating-options.component.scss'],
})
/*  Button on top left of each widget, if user can see it, with menu of possible actions for that widget.
 */
export class SafeFloatingOptionsComponent implements OnInit {
  // === WIDGET ===
  @Input() widget: any;

  // === EMIT ACTION SELECTED ===
  @Output() edit: EventEmitter<any> = new EventEmitter();
  @Output() delete: EventEmitter<any> = new EventEmitter();
  @Output() expand: EventEmitter<any> = new EventEmitter();

  // === AVAILABLE ACTIONS ===
  public items: any[] = [];

  constructor(
    public dialog: MatDialog,
    private dashboardService: SafeDashboardService,
    private translate: TranslateService
  ) {}

  /*  Set the list of available actions.
   */
  ngOnInit(): void {
    this.items = [
      {
        name: 'Settings',
        text: this.translate.instant('global.settings'),
        icon: 'insert_chart',
        disabled: !this.widget || !this.widget.settings,
      },
      {
        name: 'Expand',
        text: this.translate.instant('action.expand'),
        icon: 'open_in_full',
      },
      {
        name: 'Delete',
        text: this.translate.instant('action.delete'),
        icon: 'delete',
      },
    ];
  }

  /*  Open a modal, or emit an event depending on the action clicked.
   */
  onClick(item: any): void {
    if (item.name === 'Settings') {
      const dialogRef = this.dialog.open(SafeTileDataComponent, {
        data: {
          tile: this.widget,
          template: this.dashboardService.findSettingsTemplate(this.widget),
        },
        // hasBackdrop: false,
        position: {
          bottom: '0',
          right: '0',
        },
        panelClass: 'tile-settings-dialog',
      });
      dialogRef.afterClosed().subscribe((res) => {
        if (res) {
          this.edit.emit({ type: 'data', id: this.widget.id, options: res });
        }
      });
    }
    if (item.name === 'Expand') {
      this.expand.emit({ id: this.widget.id });
    }
    if (item.name === 'Delete') {
      const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
        data: {
          title: 'Delete Widget',
          content: `Do you confirm the deletion of the widget?`,
          confirmText: 'Delete',
          confirmColor: 'warn',
        },
      });
      dialogRef.afterClosed().subscribe((value) => {
        if (value) {
          this.delete.emit({ id: this.widget.id });
        }
      });
    }
  }
}
