import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonConfigComponent } from './button-config.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { ToggleModule } from '@oort-front/ui';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatLegacyCheckboxModule as MatCheckboxModule } from '@angular/material/legacy-checkbox';
import { MatLegacySelectModule as MatSelectModule } from '@angular/material/legacy-select';
import { SafeButtonModule } from '../../../ui/button/button.module';
import { SafeIconModule } from '../../../ui/icon/icon.module';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { SafeQueryBuilderModule } from '../../../query-builder/query-builder.module';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';

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
    MatCheckboxModule,
    MatSelectModule,
    MatTabsModule,
    MatTooltipModule,
    SafeButtonModule,
    SafeIconModule,
    SafeQueryBuilderModule,
  ],
  exports: [ButtonConfigComponent],
})
export class ButtonConfigModule {}
