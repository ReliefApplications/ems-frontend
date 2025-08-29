import { Component, forwardRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  ChipModule,
  FormWrapperModule,
  IconModule,
  SnackbarService,
  TooltipModule,
} from '@oort-front/ui';
import { emailRegex } from '../../../email/constant';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/**
 * File Explorer Request Permissions Recipients Component
 * Acts as a Angular control for managing email recipients in the file explorer.
 */
@Component({
  selector: 'shared-file-explorer-request-permissions-recipients',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    FormWrapperModule,
    IconModule,
    TooltipModule,
    ChipModule,
  ],
  templateUrl: './file-explorer-request-permissions-recipients.component.html',
  styleUrls: ['./file-explorer-request-permissions-recipients.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(
        () => FileExplorerRequestPermissionsRecipientsComponent
      ),
      multi: true,
    },
  ],
})
export class FileExplorerRequestPermissionsRecipientsComponent
  implements ControlValueAccessor
{
  /** Recipients list */
  value: string[] = [];
  /** Shared translate service */
  private translate = inject(TranslateService);
  /** Shared snackbar service */
  private snackbar = inject(SnackbarService);

  /**
   * On change
   *
   * @param _ New value
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
  onChange = (_: any) => {};
  /** Mark as touched */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched = () => {};

  /**
   * Write value
   *
   * @param obj New value
   */
  writeValue(obj: any): void {
    this.value = obj;
  }

  /**
   * Register on change
   *
   * @param fn function
   */
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  /**
   * Register on touched
   *
   * @param fn function
   */
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  /**
   * Set disabled stat
   *
   * @param isDisabled Should be disabled
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setDisabledState?(isDisabled: boolean): void {
    // Optional: handle disabled state
  }

  /**
   * To add the selected emails manually
   *
   * @param element Input Element
   */
  addEmail(element: HTMLInputElement): void {
    const newEmail = element.value.toLowerCase().trim();

    // Check if valid email
    if (!emailRegex.test(element.value)) {
      this.snackbar.openSnackBar(
        this.translate.instant(
          'components.widget.fileExplorer.accessRequestForm.fields.recipients.errors.invalid'
        ),
        {
          error: true,
        }
      );
      return;
    }

    // Check if email already exists
    if (this.value.some((email) => email.toLowerCase().trim() === newEmail)) {
      this.snackbar.openSnackBar(
        this.translate.instant(
          'components.widget.fileExplorer.accessRequestForm.fields.recipients.errors.duplicated'
        ),
        {
          error: true,
        }
      );
      return;
    }

    this.value.push(newEmail);
    this.onChange(this.value);
    element.value = '';
  }

  /**
   * Remove email from the list
   *
   * @param index email index
   */
  async removeEmail(index: number): Promise<void> {
    this.value.splice(index, 1);
    this.onChange(this.value);
  }
}
