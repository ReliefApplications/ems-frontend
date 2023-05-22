import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeModalComponent } from './modal.component';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { TooltipModule } from '@oort-front/ui';
import { SafeButtonModule } from '../button/button.module';
import { TranslateModule } from '@ngx-translate/core';

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
    SafeButtonModule,
  ],
  exports: [
    SafeModalComponent,
    TranslateModule,
    MatDialogModule,
    TooltipModule,
    SafeButtonModule,
  ],
})
export class SafeModalModule {}
