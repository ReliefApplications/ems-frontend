import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeModalComponent } from './modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SafeButtonModule } from '../button/button.module';
import { TranslateModule } from '@ngx-translate/core';
import { SafeIconModule } from '../icon/icon.module';

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
