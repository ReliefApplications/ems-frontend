import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectMenuComponent } from './select-menu.component';
import { SelectOptionModule } from './components/select-option.module';

/**
 * UI Select menu module
 */
@NgModule({
  declarations: [SelectMenuComponent],
  imports: [CommonModule, ReactiveFormsModule, SelectOptionModule],
  exports: [SelectMenuComponent, SelectOptionModule],
})
export class SelectMenuModule {}
