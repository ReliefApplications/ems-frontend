import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonConfigComponent } from './button-config.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule } from '@progress/kendo-angular-grid';
import { QueryBuilderModule } from '../../../query-builder/query-builder.module';
import { EmptyModule } from '../../../ui/empty/empty.module';
import {
  CheckboxModule,
  TooltipModule,
  ToggleModule,
  DividerModule,
  ButtonModule,
  FormWrapperModule,
  ErrorMessageModule,
  IconModule,
  TabsModule,
  SelectMenuModule,
  AlertModule,
  TextareaModule,
} from '@oort-front/ui';
import { FilterModule } from '../../../filter/filter.module';

/**
 * Button config component for grid widget.
 */
@NgModule({
  declarations: [ButtonConfigComponent],
  imports: [
    CommonModule,
    TranslateModule,
    GridModule,
    FormsModule,
    ReactiveFormsModule,
    ToggleModule,
    CheckboxModule,
    TabsModule,
    TooltipModule,
    IconModule,
    QueryBuilderModule,
    ButtonModule,
    FormWrapperModule,
    SelectMenuModule,
    ErrorMessageModule,
    IconModule,
    SelectMenuModule,
    DividerModule,
    TabsModule,
    AlertModule,
    TextareaModule,
    EmptyModule,
    FilterModule,
  ],
  exports: [ButtonConfigComponent],
})
export class ButtonConfigModule {}
