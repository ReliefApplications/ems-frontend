import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonConfigComponent } from './button-config.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { ToggleModule } from '@oort-front/ui';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { CheckboxModule } from '@oort-front/ui';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { SafeButtonModule } from '../../../ui/button/button.module';
import { SafeIconModule } from '../../../ui/icon/icon.module';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { SafeQueryBuilderModule } from '../../../query-builder/query-builder.module';
import { TooltipModule } from '@oort-front/ui';

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
    MatTabsModule,
    TooltipModule,
    SafeButtonModule,
    SafeIconModule,
    SafeQueryBuilderModule,
  ],
  exports: [ButtonConfigComponent],
})
export class ButtonConfigModule {}
