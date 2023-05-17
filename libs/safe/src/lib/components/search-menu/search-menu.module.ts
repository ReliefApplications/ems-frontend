import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeSearchMenuComponent } from './search-menu.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { SafeButtonModule } from '../ui/button/button.module';
import { MatIconModule } from '@angular/material/icon';
import { TooltipModule, DividerModule, ButtonModule } from '@oort-front/ui';

/**
 * Search menu component module.
 */
@NgModule({
  declarations: [SafeSearchMenuComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    SafeButtonModule,
    TooltipModule,
    DividerModule,
    ButtonModule,
  ],
  exports: [SafeSearchMenuComponent],
})
export class SafeSearchMenuModule {}
