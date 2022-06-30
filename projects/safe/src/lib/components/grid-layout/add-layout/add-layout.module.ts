import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { AddLayoutComponent } from './add-layout.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { SafeButtonModule } from '../../ui/button/button.module';
import { SafeLayoutModule } from '../../layout/layout.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

/**
 * Module for the addLayout component
 */
@NgModule({
  declarations: [AddLayoutComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    SafeLayoutModule,
    SafeButtonModule,
  ],
  exports: [AddLayoutComponent],
})
export class AddLayoutModule {}
