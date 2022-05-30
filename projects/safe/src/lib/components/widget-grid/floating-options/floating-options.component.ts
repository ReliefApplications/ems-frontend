import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SafeTileDataComponent } from './menu/tile-data/tile-data.component';
import { SafeDashboardService } from '../../../services/dashboard.service';
import { SafeConfirmModalComponent } from '../../confirm-modal/confirm-modal.component';
import { TranslateService } from '@ngx-translate/core';

/**
 * Button on top left of each widget, if user can see it, with menu of possible actions for that widget.
 */
@Component({
  selector: 'safe-floating-options',
  templateUrl: './floating-options.component.html',
  styleUrls: ['./floating-options.component.scss'],
})
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

  /**
   * Sets the list of available actions.
   */
  ngOnInit(): void {
    this.items = [
      {
        name: 'Settings',
        text: this.translate.instant('common.settings'),
        icon: 'insert_chart',
        disabled: !this.widget || !this.widget.settings,
      },
      {
        name: 'Expand',
        text: this.translate.instant('components.widget.expand'),
        icon: 'open_in_full',
      },
      {
        name: 'Delete',
        text: this.translate.instant('common.delete'),
        icon: 'delete',
      },
    ];
  }

  /**
   * Opens a modal, or emit an event depending on the action clicked.
   *
   * @param item action
   */
  onClick(item: any): void {
    if (item.name === 'Settings') {
      const dialogRef = this.dialog.open(SafeTileDataComponent, {
        disableClose: true,
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
          title: this.translate.instant('models.widget.delete.titleMessage'),
          content: this.translate.instant(
            'models.widget.delete.confirmationMessage'
          ),
          confirmText: this.translate.instant('components.confirmModal.delete'),
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
