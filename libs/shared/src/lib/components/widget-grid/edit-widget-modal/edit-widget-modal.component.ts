import {
  Component,
  Inject,
  ViewChild,
  ViewContainerRef,
  AfterViewInit,
  createComponent,
  EnvironmentInjector,
  ComponentRef,
} from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmService } from '../../../services/confirm/confirm.service';
import { DIALOG_DATA, DialogRef } from '@angular/cdk/dialog';
import { takeUntil } from 'rxjs';
import { UnsubscribeComponent } from '../../utils/unsubscribe/unsubscribe.component';
import { ButtonModule, DialogModule } from '@oort-front/ui';
import { WidgetSettingsType } from '../../../models/dashboard.model';
import { ApplicationService } from '../../../services/application/application.service';

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
  public widgetForm?: UntypedFormGroup;
  /** Reference to widget settings container */
  @ViewChild('settingsContainer', { read: ViewContainerRef })
  public settingsContainer!: ViewContainerRef;
  /** Settings component ref used to display content */
  private componentRef!: ComponentRef<WidgetSettingsType>;

  /**
   * Edition of widget configuration in modal.
   * The component is generic and inject specific settings component, based on the type of widget to edit.
   *
   * @param dialogRef Reference to a dialog opened via the Dialog service
   * @param data The dialog data
   * @param confirmService Shared confirm service
   * @param translate Angular translate service
   * @param environmentInjector Angular environment injector containing all registered DI for the settings component
   * @param applicationService the application service
   */
  constructor(
    public dialogRef: DialogRef<EditWidgetModalComponent>,
    @Inject(DIALOG_DATA) public data: DialogData,
    private confirmService: ConfirmService,
    private translate: TranslateService,
    private applicationService: ApplicationService,
    private environmentInjector: EnvironmentInjector
  ) {
    super();
    // Create the settings component in the modal constructor to keep all hooks ready for the view insertion
    this.componentRef = createComponent<WidgetSettingsType>(
      this.data.template,
      {
        environmentInjector: this.environmentInjector,
      }
    );
    /** Set current widget data and build up settings form in order to be ready once view is added to the DOM */
    this.componentRef.instance.widget = this.data.widget;
    this.componentRef.instance.buildSettingsForm();
    this.widgetForm = this.componentRef.instance.widgetFormGroup;
    /** Subscribe to current widget form changes */
    this.componentRef.instance.formChange
      .pipe(takeUntil(this.destroy$))
      .subscribe((e: any) => {
        this.widgetForm = e;
      });
    this.applicationService.closeApplicationSettingsDialog.subscribe(
      (isCloseAction: boolean | undefined) => {
        if (isCloseAction) {
          this.dialogRef.close();
          this.applicationService.closeApplicationSettingsDialog.next(false);
        }
      }
    );
  }

  /** Once the template is ready, inject the settings component linked to the widget type passed as a parameter. */
  ngAfterViewInit(): void {
    // Allows to set the change detector check in the next cycle so it waits until host view is complete loaded
    Promise.resolve().then(() =>
      this.settingsContainer.insert(this.componentRef.hostView)
    );
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
      this.settingsContainer.clear();
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
            this.settingsContainer.clear();
          }
        });
    }
  }
}
