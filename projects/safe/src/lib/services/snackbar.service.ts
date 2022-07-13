import { ComponentType } from '@angular/cdk/portal';
import { EmbeddedViewRef, Injectable, TemplateRef } from '@angular/core';
import {
  MatSnackBar,
  MatSnackBarConfig,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

/** Default snackbar definition */
const DEFAULT_SNACKBAR = {
  error: false,
  duration: 5000,
  data: null,
};

/** Snackbar interface */
interface SnackBar {
  duration?: number;
  error?: boolean;
  action?: string;
  data?: any;
}

/**
 * Shared snackbar service.
 * Snackbar is a brief notification that appears for a short time as a popup.
 */
@Injectable({
  providedIn: 'root',
})
export class SafeSnackBarService {
  /**
   * Shared snackbar service.
   * Snackbar is a brief notification that appears for a short time as a popup.
   *
   * @param snackBar Material snackbar service
   * @param translate Service used to get the translations.
   */
  constructor(
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) {}

  /**
   * Creates a snackbar message on top of the layout.
   *
   * @param message text message to display.
   * @param config additional configuration of the message ( duration / color / error ).
   * @returns snackbar message reference.
   */
  public openSnackBar(
    message: string,
    config?: SnackBar
  ): MatSnackBarRef<TextOnlySnackBar> {
    config = {
      ...DEFAULT_SNACKBAR,
      action: this.translate.instant('common.dismiss'),
      ...config,
    };
    const snackBarRef = this.snackBar.open(message, config.action, {
      duration: config.duration ? config.duration : undefined,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: config && config.error ? 'snack-error' : '',
    });
    return snackBarRef;
  }

  /**
   * Creates a snackbar including a component on top of the layout.
   *
   * @param component component to show inside the snackbar.
   * @param config additional configuration of the message ( duration / color / error ).
   * @returns snackbar message reference.
   */
  public openComponentSnackBar(
    component: ComponentType<any>,
    config?: SnackBar
  ): MatSnackBarRef<any> {
    config = {
      ...DEFAULT_SNACKBAR,
      action: this.translate.instant('common.dismiss'),
      ...config,
    };
    const snackBarRef = this.snackBar.openFromComponent(component, {
      duration: config.duration ? config.duration : undefined,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: config && config.error ? 'snack-error' : '',
      data: config?.data,
    });
    return snackBarRef;
  }

  /**
   * Creates a snackbar including a component on top of the layout.
   *
   * @param template component template to show inside the snackbar.
   * @param config additional configuration of the message ( duration / color / error ).
   * @returns snackbar message reference.
   */
  public openTemplateSnackBar(
    template: TemplateRef<any>,
    config?: SnackBar
  ): MatSnackBarRef<EmbeddedViewRef<any>> {
    config = {
      ...DEFAULT_SNACKBAR,
      action: this.translate.instant('common.dismiss'),
      ...config,
    };
    const snackBarRef = this.snackBar.openFromTemplate(template, {
      duration: config.duration ? config.duration : undefined,
      horizontalPosition: 'center',
      verticalPosition: 'top',
      panelClass: config && config.error ? 'snack-error' : '',
    });
    return snackBarRef;
  }
}
