import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeLayoutModalComponent } from './layout-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SafeButtonModule } from '../ui/button/button.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [SafeLayoutModalComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatDialogModule,
    MatTooltipModule,
    MatButtonModule,
    SafeButtonModule,
  ],
  exports: [SafeLayoutModalComponent],
})
export class SafeLayoutModalModule {}
