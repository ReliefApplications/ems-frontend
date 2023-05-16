import { Component, OnInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  Application,
  SafeApplicationService,
  PositionAttributeCategory,
  SafeConfirmService,
  SafeUnsubscribeComponent,
} from '@oort-front/safe';
import { takeUntil } from 'rxjs/operators';
import { Variant, Category } from '@oort-front/ui';

/**
 * Application position component.
 */
@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.scss'],
})
export class PositionComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  // === DATA ===
  public loading = true;
  public positionCategories: any[] = [];
  public displayedColumns = ['title', 'actions'];

  // === BUTTON ===
  public variant = Variant;
  public category = Category;

  /**
   * Application position component
   *
   * @param dialog Material dialog service
   * @param applicationService Shared application service
   * @param confirmService Shared confirm service
   * @param translate Angular translate service
   */
  constructor(
    public dialog: MatDialog,
    private applicationService: SafeApplicationService,
    private confirmService: SafeConfirmService,
    private translate: TranslateService
  ) {
    super();
  }

  ngOnInit(): void {
    this.loading = false;
    this.applicationService.application$
      .pipe(takeUntil(this.destroy$))
      .subscribe((application: Application | null) => {
        if (application) {
          this.positionCategories =
            application.positionAttributeCategories || [];
        } else {
          this.positionCategories = [];
        }
      });
  }

  /**
   * Add new position
   */
  async onAdd(): Promise<void> {
    const { PositionModalComponent } = await import(
      './components/position-modal/position-modal.component'
    );
    const dialogRef = this.dialog.open(PositionModalComponent, {
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

  /**
   * Edit position category
   *
   * @param positionCategory position category to edit
   */
  async onEdit(positionCategory: PositionAttributeCategory): Promise<void> {
    const { PositionModalComponent } = await import(
      './components/position-modal/position-modal.component'
    );
    const dialogRef = this.dialog.open(PositionModalComponent, {
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

  /**
   * Delete position category
   *
   * @param positionCategory position category to delete
   */
  onDelete(positionCategory: PositionAttributeCategory): void {
    const dialogRef = this.confirmService.openConfirmModal({
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
      confirmColor: 'warn',
    });
    dialogRef.afterClosed().subscribe((value) => {
      if (value) {
        this.applicationService.deletePositionAttributeCategory(
          positionCategory
        );
      }
    });
  }
}
