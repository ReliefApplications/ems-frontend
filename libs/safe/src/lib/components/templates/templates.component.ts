import { Component, Input, OnInit } from '@angular/core';
import { SafeApplicationService } from '../../services/application/application.service';
import { TemplateTypeEnum } from '../../models/template.model';
import { Dialog } from '@angular/cdk/dialog';
import { takeUntil } from 'rxjs';
import { SafeUnsubscribeComponent } from '../utils/unsubscribe/unsubscribe.component';
import { SnackbarService } from '@oort-front/ui';
import { TranslateService } from '@ngx-translate/core';

/**
 * A component to display the list of templates of an application
 */
@Component({
  selector: 'safe-templates',
  templateUrl: './templates.component.html',
  styleUrls: ['./templates.component.scss'],
})
export class SafeTemplatesComponent
  extends SafeUnsubscribeComponent
  implements OnInit
{
  // === INPUT DATA ===
  public templates: Array<any> = new Array<any>();
  @Input() applicationService!: SafeApplicationService;

  // === DISPLAYED COLUMNS ===
  public displayedColumns = ['name', 'type', 'actions'];

  public loading = false;

  /**
   * Constructor of the templates component
   *
   * @param dialog The Dialog service
   * @param translate The translation service
   * @param snackBar Shared snackbar service
   */
  constructor(
    public dialog: Dialog,
    private translate: TranslateService,
    private snackBar: SnackbarService
  ) {
    super();
  }

  ngOnInit(): void {
    this.applicationService.application$
      .pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        this.templates = value?.templates || [];
      });
  }

  /**
   * Show a dialog to edit a template
   *
   * @param template The template to edit
   */
  async editEmailTemplate(template: any): Promise<void> {
    const { EditTemplateModalComponent } = await import(
      './components/edit-template-modal/edit-template-modal.component'
    );
    const dialogRef = this.dialog.open(EditTemplateModalComponent, {
      data: template,
      disableClose: true,
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.applicationService.editTemplate({
          id: template.id,
          name: value.name,
          type: TemplateTypeEnum.EMAIL,
          content: {
            subject: value.subject,
            body: value.body,
          },
        });
        this.snackBar.openSnackBar(
          this.translate.instant('common.notifications.objectUpdated', {
            value: value.name,
            type: this.translate.instant('common.template.one'),
          })
        );
      }
    });
  }

  /**
   * Show a dialog to confirm the deletion of a template
   *
   * @param template template to be deleted
   */
  async deleteTemplate(template: any): Promise<void> {
    const { SafeConfirmModalComponent } = await import(
      '../confirm-modal/confirm-modal.component'
    );
    const dialogRef = this.dialog.open(SafeConfirmModalComponent, {
      data: {
        title: this.translate.instant('common.deleteObject', {
          name: this.translate.instant('common.template.one'),
        }),
        content: this.translate.instant(
          'components.templates.delete.confirmationMessage',
          {
            name: template.name,
          }
        ),
        confirmText: this.translate.instant('components.confirmModal.delete'),
        cancelText: this.translate.instant('components.confirmModal.cancel'),
        confirmVariant: 'danger',
      },
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.applicationService.deleteTemplate(template.id);
        this.snackBar.openSnackBar(
          this.translate.instant('common.notifications.objectDeleted', {
            value: template.name,
          })
        );
      }
    });
  }

  /** Opens modal for adding a new email template */
  async addEmailTemplate(): Promise<void> {
    const { EditTemplateModalComponent } = await import(
      './components/edit-template-modal/edit-template-modal.component'
    );
    const dialogRef = this.dialog.open(EditTemplateModalComponent, {
      disableClose: true,
    });
    dialogRef.closed.pipe(takeUntil(this.destroy$)).subscribe((value: any) => {
      if (value) {
        this.applicationService.addTemplate({
          name: value.name,
          type: TemplateTypeEnum.EMAIL,
          content: {
            subject: value.subject,
            body: value.body,
          },
        });
        this.snackBar.openSnackBar(
          this.translate.instant('common.notifications.objectCreated', {
            value: value.name,
            type: this.translate.instant('common.template.one'),
          })
        );
      }
    });
  }
}
