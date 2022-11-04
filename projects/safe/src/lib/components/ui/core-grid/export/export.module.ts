import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeExportComponent } from './export.component';
import { MatDialogModule } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslateModule } from '@ngx-translate/core';
import { SafeModalModule } from '../../modal/modal.module';

/** Module for the export component */
@NgModule({
  declarations: [SafeExportComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatRadioModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
    MatSlideToggleModule,
    TranslateModule,
    SafeModalModule,
  ],
  exports: [SafeExportComponent],
})
export class SafeExportModule {}
