import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeModalComponent } from './modal.component';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { TooltipModule, ButtonModule } from '@oort-front/ui';
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
    TooltipModule,
    SafeIconModule,
    ButtonModule,
  ],
  exports: [
    SafeModalComponent,
    TranslateModule,
    MatDialogModule,
    TooltipModule,
    SafeIconModule,
    ButtonModule,
  ],
})
export class SafeModalModule {}
