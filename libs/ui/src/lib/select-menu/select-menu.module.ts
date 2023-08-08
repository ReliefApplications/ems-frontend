import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectMenuComponent } from './select-menu.component';
import { SelectOptionModule } from './components/select-option.module';
import { TranslateModule } from '@ngx-translate/core';
import { IconModule } from '../icon/icon.module';

/**
 * UI Select menu module
 */
@NgModule({
  declarations: [SelectMenuComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SelectOptionModule,
    TranslateModule,
    IconModule,
  ],
  exports: [SelectMenuComponent, SelectOptionModule],
})
export class SelectMenuModule {}
