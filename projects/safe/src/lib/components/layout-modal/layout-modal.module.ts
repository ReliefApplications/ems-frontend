import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeLayoutModalComponent } from './layout-modal.component';
import { MatDialogModule } from '@angular/material/dialog';
import { SafeButtonModule } from '../ui/button/button.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { SafeQueryBuilderModule } from '../query-builder/query-builder.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SafeLayoutModalComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    MatDialogModule,
    MatTooltipModule,
    MatButtonModule,
    MatFormFieldModule,
    SafeButtonModule,
    SafeQueryBuilderModule,
  ],
  exports: [SafeLayoutModalComponent],
})
export class SafeLayoutModalModule {}
