import {
  Component,
  Inject,
  ViewChild,
  ViewContainerRef,
  AfterViewInit,
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SafeConfirmService } from '../../../../../services/confirm/confirm.service';
import { Dialog, DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { takeUntil } from 'rxjs';
import { SafeUnsubscribeComponent } from '../../../../utils/unsubscribe/unsubscribe.component';

/** Model for dialog data */
interface DialogData {
  tile: any;
  template: any;
}

/** Component for a data tile */
@Component({
  selector: 'safe-tile-data',
  templateUrl: './tile-data.component.html',
  styleUrls: ['./tile-data.component.scss'],
})
/** Modal content to edit the settings of a component. */
export class SafeTileDataComponent
  extends SafeUnsubscribeComponent
  implements AfterViewInit
{
  // === REACTIVE FORM ===
  tileForm?: UntypedFormGroup;

  // === TEMPLATE REFERENCE ===
  @ViewChild('settingsContainer', { read: ViewContainerRef })
  settingsContainer: any;

  /**
   * Constructor of a data tile
   *
   * @param dialogRef Reference to a dialog opened via the material dialog service
   * @param data The dialog data
   * @param confirmService Shared confirm service
   * @param translate Angular translate service
   * @param dialog Material dialog service
   */
  constructor(
    public dialogRef: DialogRef<SafeTileDataComponent>,
    @Inject(DIALOG_DATA) public data: DialogData,
    private confirmService: SafeConfirmService,
    private translate: TranslateService,
    private dialog: Dialog
  ) {
    super();
  }

  /** Once the template is ready, inject the settings component linked to the widget type passed as a parameter. */
  ngAfterViewInit(): void {
    const componentRef = this.settingsContainer.createComponent(
      this.data.template
    );
    componentRef.instance.tile = this.data.tile;
    componentRef.instance.change.subscribe((e: any) => {
      this.tileForm = e;
    });
  }

  /**
   * Closes the modal sending tile form value.
   */
  onSubmit(): void {
    this.dialogRef.close(this.tileForm?.getRawValue());
  }

  /**
   * Custom close method of dialog.
   * Check if the form is updated or not, and display a confirmation modal if changes detected.
   */
  onClose(): void {
    if (this.tileForm?.pristine) {
      this.dialogRef.close();
    } else {
      const confirmDialogRef = this.confirmService.openConfirmModal({
        title: this.translate.instant('common.close'),
        content: this.translate.instant(
          'components.widget.settings.close.confirmationMessage'
        ),
        confirmText: this.translate.instant('components.confirmModal.confirm'),
        confirmColor: 'warn',
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
