import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkListboxModule } from '@angular/cdk/listbox';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SelectMenuComponent } from './select-menu.component';

/**
 * UI select menu module
 */
@NgModule({
  declarations: [SelectMenuComponent],
  imports: [CommonModule, CdkListboxModule, ReactiveFormsModule, FormsModule],
  exports: [SelectMenuComponent, CdkListboxModule],
})
export class SelectMenuModule {}
