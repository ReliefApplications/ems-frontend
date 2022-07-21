import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SafeTileDataComponent } from './menu/tile-data/tile-data.component';
import { SafeDashboardService } from '../../../services/dashboard.service';
import { SafeConfirmModalComponent } from '../../confirm-modal/confirm-modal.component';
import { TranslateService } from '@ngx-translate/core';
import { Application } from '../../../models/application.model';
import { SafeAuthService } from '../../../services/auth.service';

/**
 * Button on top left of each widget, if user can see it, with menu of possible
 * actions for that widget.
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
  @Output() duplicate: EventEmitter<any> = new EventEmitter();

  // === AVAILABLE ACTIONS ===
  public items: any[] = [];

  // === DUPLICATION OF WIDGET
  @Input() applicationId?: string;
  public showAppMenu = false;
  public applications: Application[] = [];

  /**
   * Constructor of floating options component
   *
   * @param dialog Material dialog service
   * @param dashboardService Dashboard service
   * @param translate Translation service
   * @param authService Used to get user permisions
   */
  constructor(
    public dialog: MatDialog,
    private dashboardService: SafeDashboardService,
    private translate: TranslateService,
    private authService: SafeAuthService
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
        name: 'Duplicate',
        text: this.translate.instant('common.duplicate'),
        icon: 'file_copy',
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
    if (item.name === 'Duplicate') {
      this.showAppMenu = !this.showAppMenu;
      const authSubscription = this.authService.user$.subscribe(
        (user: any | null) => {
          if (user) {
            this.applications = user.applications;
          }
        }
      );
      authSubscription.unsubscribe();
    }
    if (item.name === 'Delete') {
      const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
        data: {
          title: this.translate.instant('models.widget.delete.title'),
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

  /**
   * Emits the duplicate event, returns the widget id to duplicate and the selected dashboard id
   *
   * @param event Dashboard where the widget will be duplicated
   */
  public onDuplicate(event: any) {
    this.duplicate.emit({
      widgetId: this.widget.id,
      dashboardId: event.content,
    });
  }
}
