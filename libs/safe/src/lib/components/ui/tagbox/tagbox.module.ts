import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeTagboxComponent } from './tagbox.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ChipModule,
  IconModule,
  TooltipModule,
  AutocompleteModule,
} from '@oort-front/ui';

/**
 * Module declaration for safe-tagbox component
 */
@NgModule({
  declarations: [SafeTagboxComponent],
  imports: [
    CommonModule,
    TranslateModule,
    IconModule,
    ReactiveFormsModule,
    FormsModule,
    TooltipModule,
    ChipModule,
    AutocompleteModule,
  ],
  exports: [SafeTagboxComponent],
})
export class SafeTagboxModule {}
