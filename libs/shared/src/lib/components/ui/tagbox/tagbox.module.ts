import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TagboxComponent } from './tagbox.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ChipModule,
  IconModule,
  TooltipModule,
  AutocompleteModule,
} from '@oort-front/ui';

/**
 * Module declaration for shared-tagbox component
 */
@NgModule({
  declarations: [TagboxComponent],
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
  exports: [TagboxComponent],
})
export class TagboxModule {}
