import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { SafeStatusModalComponent } from './status-modal.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
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
