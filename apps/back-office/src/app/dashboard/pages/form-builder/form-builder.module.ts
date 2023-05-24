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
import { SpinnerModule } from '@oort-front/ui';
import { HistoryComponent } from './components/history/history.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { TranslateModule } from '@ngx-translate/core';
import { TableModule } from '@oort-front/ui';

/**
 * Form builder module.
 */
@NgModule({
  declarations: [FormBuilderComponent, HistoryComponent],
  imports: [
    CommonModule,
    FormBuilderRoutingModule,
    SpinnerModule,
    MatButtonToggleModule,
    SafeFormBuilderModule,
    SafeAccessModule,
    TranslateModule,
    SafeDateModule,
    SafeEditableTextModule,
    TableModule,
  ],
  exports: [FormBuilderComponent],
})
export class FormBuilderModule {}
