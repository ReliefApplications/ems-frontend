import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonConfigComponent } from './button-config.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GridModule } from '@progress/kendo-angular-grid';
import { QueryBuilderModule } from '../../../query-builder/query-builder.module';
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
} from '@oort-front/ui';

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
  ],
  exports: [ButtonConfigComponent],
})
export class ButtonConfigModule {}
