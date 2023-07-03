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
import {
  ChipModule,
  FormWrapperModule,
  SelectMenuModule,
  SpinnerModule,
  TableModule,
} from '@oort-front/ui';
import { HistoryComponent } from './components/history/history.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

/**
 * Form builder module.
 */
@NgModule({
  declarations: [FormBuilderComponent, HistoryComponent],
  imports: [
    CommonModule,
    FormBuilderRoutingModule,
    SpinnerModule,
    SafeFormBuilderModule,
    SafeAccessModule,
    TranslateModule,
    SafeDateModule,
    SafeEditableTextModule,
    TableModule,
    ChipModule,
    SelectMenuModule,
    FormWrapperModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [FormBuilderComponent],
})
export class FormBuilderModule {}
