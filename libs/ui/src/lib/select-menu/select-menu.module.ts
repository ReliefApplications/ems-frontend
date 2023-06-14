import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectMenuComponent } from './select-menu.component';
import { SelectOptionModule } from './components/select-option.module';
import { SpinnerModule } from '../spinner/spinner.module';
import { ButtonModule } from '../button/button.module';
import { TranslateModule } from '@ngx-translate/core';

/**
 * UI Select menu module
 */
@NgModule({
  declarations: [SelectMenuComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SelectOptionModule,
    SpinnerModule,
    ButtonModule,
    TranslateModule,
  ],
  exports: [SelectMenuComponent, SelectOptionModule],
})
export class SelectMenuModule {}
