import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeModalComponent } from './modal.component';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { SafeButtonModule } from '../button/button.module';
import { TranslateModule } from '@ngx-translate/core';
import { SafeIconModule } from '../icon/icon.module';

/**
 * Modal component, used as a generic wrapper for all modals
 */
@NgModule({
  declarations: [SafeModalComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatDialogModule,
    MatTooltipModule,
    SafeButtonModule,
    SafeIconModule,
  ],
  exports: [
    SafeModalComponent,
    TranslateModule,
    MatDialogModule,
    MatTooltipModule,
    SafeButtonModule,
    SafeIconModule,
  ],
})
export class SafeModalModule {}
