import {
  Component,
  Inject,
  ViewChild,
  ViewContainerRef,
  AfterViewInit,
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmService } from '../../../services/confirm/confirm.service';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { takeUntil } from 'rxjs';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { ButtonModule, DialogModule } from '@oort-front/ui';

/** Model for dialog data */
interface DialogData {
  widget: any;
  template: any;
}

/**
 * Edition of widget configuration in modal.
 * The component is generic and inject specific settings component, based on the type of widget to edit.
 */
@Component({
  standalone: true,
  selector: 'shared-edit-widget-modal',
  templateUrl: './edit-widget-modal.component.html',
  styleUrls: ['./edit-widget-modal.component.scss'],
  imports: [DialogModule, ButtonModule],
})
/** Modal content to edit the settings of a component. */
export class EditWidgetModalComponent
  extends UnsubscribeComponent
  implements AfterViewInit
{
  /** Widget reactive form */
  widgetForm?: UntypedFormGroup;

  /** Reference to widget settings container */
  @ViewChild('settingsContainer', { read: ViewContainerRef })
  settingsContainer: any;

  /**
   * Edition of widget configuration in modal.
   * The component is generic and inject specific settings component, based on the type of widget to edit.
   *
   * @param dialogRef Reference to a dialog opened via the Dialog service
   * @param data The dialog data
   * @param confirmService Shared confirm service
   * @param translate Angular translate service
   */
  constructor(
    public dialogRef: DialogRef<EditWidgetModalComponent>,
    @Inject(DIALOG_DATA) public data: DialogData,
    private confirmService: ConfirmService,
    private translate: TranslateService
  ) {
    super();
  }

  /** Once the template is ready, inject the settings component linked to the widget type passed as a parameter. */
  ngAfterViewInit(): void {
    const componentRef = this.settingsContainer.createComponent(
      this.data.template
    );
    componentRef.instance.widget = this.data.widget;
    componentRef.instance.change.subscribe((e: any) => {
      this.widgetForm = e;
    });
  }

  /**
   * Closes the modal sending widget form value.
   */
  onSubmit(): void {
    this.dialogRef.close(this.widgetForm?.getRawValue());
  }

  /**
   * Custom close method of dialog.
   * Check if the form is updated or not, and display a confirmation modal if changes detected.
   */
  onClose(): void {
    if (this.widgetForm?.pristine) {
      this.dialogRef.close();
    } else {
      const confirmDialogRef = this.confirmService.openConfirmModal({
        title: this.translate.instant('common.close'),
        content: this.translate.instant(
          'components.widget.settings.close.confirmationMessage'
        ),
        confirmText: this.translate.instant('components.confirmModal.confirm'),
        confirmVariant: 'danger',
      });
      confirmDialogRef.closed
        .pipe(takeUntil(this.destroy$))
        .subscribe((value: any) => {
          if (value) {
            this.dialogRef.close();
          }
        });
    }
  }
}
