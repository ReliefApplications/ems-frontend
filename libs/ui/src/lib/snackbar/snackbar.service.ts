import { ComponentType } from '@angular/cdk/portal';
import {
  ApplicationRef,
  ComponentRef,
  EnvironmentInjector,
  Inject,
  Injectable,
  TemplateRef,
  createComponent,
} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarComponent } from './snackbar.component';
import { SnackBarConfig } from './interfaces/snackbar.interfaces';
import { DOCUMENT } from '@angular/common';

/** Default snackbar definition */
const DEFAULT_SNACKBAR = {
  error: false,
  duration: 5000,
  data: null,
};

/**
 * UI Snackbar service
 */
@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  public shadowDom!: any;

  /**
   * Shared snackbar service.
   * Snackbar is a brief notification that appears for a short time as a popup.
   *
   * @param document Document token containing current browser document
   * @param translate Angular translate service
   * @param app Application reference
   * @param injector Environment injector to create snackbar component
   */
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private translate: TranslateService,
    private app: ApplicationRef,
    private injector: EnvironmentInjector
  ) {}

  /**
   * Attach the snackbar to the document's body and add the component to the applications change detector ref
   *
   * @param snackBar SnackbarComponent component reference
   */
  private updateView(snackBar: ComponentRef<SnackbarComponent>) {
    const appendBody = this.shadowDom ?? this.document.body;
    appendBody.appendChild(snackBar.location.nativeElement);
    this.app.attachView(snackBar.hostView);
    snackBar.changeDetectorRef.detectChanges();
  }

  /**
   * Creates a snackbar message on top of the layout.
   *
   * @param message text message to display.
   * @param config additional configuration of the message ( duration / color / error ).
   * @returns snackbar message reference.
   */
  public openSnackBar(message: string, config?: SnackBarConfig): any {
    config = {
      ...DEFAULT_SNACKBAR,
      ...config,
    };
    const snackBar = createComponent(SnackbarComponent, {
      environmentInjector: this.injector,
    });
    snackBar.instance.open(message, config);
    this.updateView(snackBar);
    return snackBar;
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
    config?: SnackBarConfig
  ): any {
    config = {
      ...DEFAULT_SNACKBAR,
      ...config,
    };
    const snackBar = createComponent(SnackbarComponent, {
      environmentInjector: this.injector,
    });
    snackBar.instance.openFromComponent(component, config);
    this.updateView(snackBar);
    return snackBar;
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
    config?: SnackBarConfig
  ): any {
    config = {
      ...DEFAULT_SNACKBAR,
      ...config,
    };
    const snackBar = createComponent(SnackbarComponent, {
      environmentInjector: this.injector,
    });
    snackBar.instance.openFromTemplate(template, config);
    this.updateView(snackBar);
    return snackBar;
  }
}
