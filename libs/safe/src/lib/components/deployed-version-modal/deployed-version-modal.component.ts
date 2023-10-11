import { Component, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import {
  DialogModule,
  ButtonModule,
  FormWrapperModule,
  IconModule,
  TooltipModule,
  SnackbarService,
} from '@oort-front/ui';

/**
 * Component to show the deployed version
 */
@Component({
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    IconModule,
    DialogModule,
    FormWrapperModule,
    TooltipModule,
  ],
  selector: 'safe-deployed-version-modal',
  templateUrl: './deployed-version-modal.component.html',
  styleUrls: ['./deployed-version-modal.component.scss'],
})
export class DeployedVersionModalComponent {
  public environment: any;

  /**
   * The constructor function is a special function that is called when a new instance of the class is
   * created.
   *
   * @param environment This is the environment in which we are running the application
   * @param translate This is the Angular service that translates text
   * @param snackBar Shared snackbar service
   */
  constructor(
    @Inject('environment') environment: any,
    private translate: TranslateService,
    private snackBar: SnackbarService
  ) {
    this.environment = environment;
  }

  copyToClipboard(value: string) {
    navigator.clipboard.writeText(value);
    this.snackBar.openSnackBar(
      this.translate.instant('components.deployedVersion.copied')
    );
  }
}
