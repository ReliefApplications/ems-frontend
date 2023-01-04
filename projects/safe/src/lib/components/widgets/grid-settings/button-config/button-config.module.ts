import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonConfigComponent } from './button-config.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { SafeButtonModule } from '../../../ui/button/button.module';
import { SafeIconModule } from '../../../ui/icon/icon.module';
import { MatTabsModule } from '@angular/material/tabs';
import { SafeQueryBuilderModule } from '../../../query-builder/query-builder.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SafePlaceholderModule } from '../../../../pipes/placeholder/placeholder.module';

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
    MatSlideToggleModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatTabsModule,
    MatTooltipModule,
    SafeButtonModule,
    SafeIconModule,
    SafeQueryBuilderModule,
    SafePlaceholderModule,
  ],
  exports: [ButtonConfigComponent],
})
export class ButtonConfigModule {}
