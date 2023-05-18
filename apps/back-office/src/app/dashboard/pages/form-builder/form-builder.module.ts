import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilderRoutingModule } from './form-builder-routing.module';
import { FormBuilderComponent } from './form-builder.component';
import {
  SafeAccessModule,
  SafeFormBuilderModule,
  SafeDateModule,
  SafeEditableTextModule,
} from '@oort-front/safe';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { HistoryComponent } from './components/history/history.component';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
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
    TranslateModule,
    SafeDateModule,
    SafeEditableTextModule,
  ],
  exports: [FormBuilderComponent],
})
export class FormBuilderModule {}
