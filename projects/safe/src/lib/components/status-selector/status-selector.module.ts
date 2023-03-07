import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { StatusSelectorComponent } from './status-selector.component';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatSelectModule } from '@angular/material/select';
// import { MatChipsModule } from '@angular/material/chips';
import { MatLegacyChipsModule } from '@angular/material/legacy-chips';
import { SafeIconModule } from '../ui/icon/icon.module';
import { MatListModule } from '@angular/material/list';

@NgModule({
  declarations: [StatusSelectorComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatLegacyChipsModule,
    MatListModule,
    // MatChipsModule,
    SafeIconModule,
  ],
  exports: [StatusSelectorComponent],
})
export class StatusSelectorModule {}
