import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonConfigComponent } from './button-config.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { SafeIconModule } from '../../../ui/icon/icon.module';
import { TabsModule } from '@oort-front/ui';
import { SafeQueryBuilderModule } from '../../../query-builder/query-builder.module';
import {
  CheckboxModule,
  TooltipModule,
  ToggleModule,
  ButtonModule,
  FormWrapperModule,
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
    MatFormFieldModule,
    ToggleModule,
    MatInputModule,
    CheckboxModule,
    MatSelectModule,
    TabsModule,
    TooltipModule,
    SafeIconModule,
    SafeQueryBuilderModule,
    ButtonModule,
    FormWrapperModule,
  ],
  exports: [ButtonConfigComponent],
})
export class ButtonConfigModule {}
