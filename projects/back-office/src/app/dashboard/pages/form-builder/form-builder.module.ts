import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilderRoutingModule } from './form-builder-routing.module';
import { FormBuilderComponent } from './form-builder.component';
import {
  SafeAccessModule,
  SafeFormBuilderModule,
  SafeButtonModule,
  SafeDateModule,
} from '@safe/builder';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HistoryComponent } from './components/history/history.component';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [FormBuilderComponent, HistoryComponent],
  imports: [
    CommonModule,
    FormBuilderRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonToggleModule,
    SafeFormBuilderModule,
    SafeAccessModule,
    SafeButtonModule,
    TranslateModule,
    SafeDateModule,
  ],
  exports: [FormBuilderComponent],
})
export class FormBuilderModule {}
