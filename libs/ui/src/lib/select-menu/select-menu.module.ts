import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkListboxModule } from '@angular/cdk/listbox';
import { ReactiveFormsModule } from '@angular/forms';
import { SelectMenuComponent } from './select-menu.component';

/**
 * UI Select menu module
 */
@NgModule({
  declarations: [SelectMenuComponent],
  imports: [CommonModule, CdkListboxModule, ReactiveFormsModule],
  exports: [SelectMenuComponent],
})
export class SelectMenuModule {}
