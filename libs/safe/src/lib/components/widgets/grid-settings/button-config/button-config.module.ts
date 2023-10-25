import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonConfigComponent } from './button-config.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafeQueryBuilderModule } from '../../../query-builder/query-builder.module';
import {
  CheckboxModule,
  TooltipModule,
  ToggleModule,
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
    FormsModule,
    ReactiveFormsModule,
    ToggleModule,
    CheckboxModule,
    TabsModule,
    TooltipModule,
    IconModule,
    SafeQueryBuilderModule,
    ButtonModule,
    FormWrapperModule,
    SelectMenuModule,
    ErrorMessageModule,
    IconModule,
    SelectMenuModule,
    TabsModule,
    AlertModule,
  ],
  exports: [ButtonConfigComponent],
})
export class ButtonConfigModule {}
