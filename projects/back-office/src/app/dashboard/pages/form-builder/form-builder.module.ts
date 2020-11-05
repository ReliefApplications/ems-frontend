import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormBuilderRoutingModule } from './form-builder-routing.module';
import { FormBuilderComponent } from './form-builder.component';
import { WhoAccessModule, WhoFormBuilderModule } from 'who-shared';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HistoryComponent } from './components/history/history.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@NgModule({
  declarations: [FormBuilderComponent, HistoryComponent],
  imports: [
    CommonModule,
    FormBuilderRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    WhoFormBuilderModule,
    WhoAccessModule
  ],
  exports: [FormBuilderComponent]
})
export class FormBuilderModule { }
