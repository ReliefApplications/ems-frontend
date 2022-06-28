import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  Application,
  SafeApplicationService,
  PositionAttributeCategory,
  SafeConfirmModalComponent,
} from '@safe/builder';
import { Subscription } from 'rxjs';
import { AddPositionComponent } from './components/position-modal/position-modal.component';

@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.scss'],
})
export class PositionComponent implements OnInit, OnDestroy {
  // === DATA ===
  public loading = true;
  public positionCategories: any[] = [];
  public displayedColumns = ['title', 'actions'];
  private applicationSubscription?: Subscription;

  constructor(
    public dialog: MatDialog,
    private applicationService: SafeApplicationService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loading = false;
    this.applicationSubscription =
      this.applicationService.application$.subscribe(
        (application: Application | null) => {
          if (application) {
            this.positionCategories =
              application.positionAttributeCategories || [];
          } else {
            this.positionCategories = [];
          }
        }
      );
  }

  onAdd(): void {
    const dialogRef = this.dialog.open(AddPositionComponent, {
      data: {
        add: true,
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.applicationService.addPositionAttributeCategory(value);
      }
    });
  }

  onEdit(positionCategory: PositionAttributeCategory): void {
    const dialogRef = this.dialog.open(AddPositionComponent, {
      width: '400px',
      data: {
        edit: true,
        title: positionCategory.title,
      },
    });
    dialogRef.afterClosed().subscribe((value: any) => {
      if (value) {
        this.applicationService.editPositionAttributeCategory(
          value,
          positionCategory
        );
      }
    });
  }

  onDelete(positionCategory: PositionAttributeCategory): void {
    const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
      data: {
        title: this.translate.instant(
          'components.application.positionAttribute.delete.title'
        ),
        content: this.translate.instant(
          'components.application.positionAttribute.delete.confirmationMessage',
          {
            name: positionCategory.title,
          }
        ),
        confirmText: this.translate.instant('components.confirmModal.delete'),
        cancelText: this.translate.instant('components.confirmModal.cancel'),
        confirmColor: 'warn',
      },
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.applicationService.deletePositionAttributeCategory(
          positionCategory
        );
      }
    });
  }

  ngOnDestroy(): void {
    if (this.applicationSubscription) {
      this.applicationSubscription.unsubscribe();
    }
  }
}
