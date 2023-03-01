import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { SafeStatusModalComponent } from './status-modal.component';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { SafeModalModule } from '../ui/modal/modal.module';

/**
 * SafeStatusModalModule is a class used to manage all the modules and components
 * related to the modals showing the status of an element.
 */
@NgModule({
  declarations: [SafeStatusModalComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    SafeModalModule,
  ],
})
export class SafeStatusModalModule {}
