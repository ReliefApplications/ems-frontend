import { Component, OnInit } from '@angular/core';
import { Dialog } from '@angular/cdk/dialog';
import { TranslateService } from '@ngx-translate/core';
import {
  Application,
  ApplicationService,
  PositionAttributeCategory,
  ConfirmService,
  UnsubscribeComponent,
} from '@oort-front/shared';
import { takeUntil } from 'rxjs/operators';

/**
 * Application position component.
 */
@Component({
  selector: 'app-position',
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.scss'],
})
export class PositionComponent extends UnsubscribeComponent implements OnInit {
  // === DATA ===
  /** Loading state */
  public loading = true;
  /** Position categories */
  public positionCategories: any[] = [];
  /** Table columns */
  public displayedColumns = ['title', 'actions'];

  /**
   * Application position component
   *
   * @param dialog Dialog service
   * @param applicationService Shared application service
   * @param confirmService Shared confirm service
   * @param translate Angular translate service
   */
  constructor(
    public dialog: Dialog,
    private applicationService: ApplicationService,
    private confirmService: ConfirmService,
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
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value) => {
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
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
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
      confirmVariant: 'danger',
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.applicationService.deletePositionAttributeCategory(
          positionCategory
        );
      }
    });
  }
}
