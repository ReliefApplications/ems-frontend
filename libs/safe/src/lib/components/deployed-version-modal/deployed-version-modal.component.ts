import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import {
  DialogModule,
  ButtonModule,
  FormWrapperModule,
  IconModule,
  TooltipModule,
  SnackbarService
} from '@oort-front/ui';

@Component({
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    IconModule,
    DialogModule,
    FormWrapperModule,
    TooltipModule
  ], 
  selector: 'safe-deployed-version-modal',
  templateUrl: './deployed-version-modal.component.html',
  styleUrls: ['./deployed-version-modal.component.scss'],
})
export class DeployedVersionModalComponent {
  constructor(
    private translate: TranslateService,
    private snackBar: SnackbarService
  ) {}

  copyToClipboard(value: string) {
    navigator.clipboard.writeText(value);
    this.snackBar.openSnackBar(
      this.translate.instant('components.deployedVersion.copied')
    );
  }
}