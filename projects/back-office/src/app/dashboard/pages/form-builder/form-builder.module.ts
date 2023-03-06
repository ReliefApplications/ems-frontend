import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilderRoutingModule } from './form-builder-routing.module';
import { FormBuilderComponent } from './form-builder.component';
import {
  SafeAccessModule,
  SafeFormBuilderModule,
  SafeButtonModule,
  SafeDateModule,
  SafeEditableTextModule,
} from '@safe/builder';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { HistoryComponent } from './components/history/history.component';
import { MatTableModule } from '@angular/material/table';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Form builder module.
 */
@NgModule({
  declarations: [FormBuilderComponent, HistoryComponent],
  imports: [
    CommonModule,
    FormBuilderRoutingModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatButtonToggleModule,
    SafeFormBuilderModule,
    SafeAccessModule,
    SafeButtonModule,
    TranslateModule,
    SafeDateModule,
    SafeEditableTextModule,
  ],
  exports: [FormBuilderComponent],
})
export class FormBuilderModule {}
