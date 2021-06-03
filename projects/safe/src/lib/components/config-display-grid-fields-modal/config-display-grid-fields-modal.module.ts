import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ConfigDisplayGridFieldsModalComponent } from './config-display-grid-fields-modal.component';
import { SafeQueryBuilderModule } from '../query-builder/query-builder.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [ConfigDisplayGridFieldsModalComponent],
  imports: [
    CommonModule,
    MatDialogModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    SafeQueryBuilderModule,
  ],
  exports: [ConfigDisplayGridFieldsModalComponent]
})
export class ConfigDisplayGridFieldsModalModule { }
