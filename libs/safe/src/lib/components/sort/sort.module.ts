import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SortGroupComponent } from './sort-group/sort-group.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  SelectMenuModule,
  FormWrapperModule,
} from '@oort-front/ui';
import { SafeSortComponent } from './sort.component';
import { SortRowComponent } from './sort-row/sort-row.component';

/**
 * Composite Sort module.
 */
@NgModule({
  declarations: [SortGroupComponent, SafeSortComponent, SortRowComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    SelectMenuModule,
    FormWrapperModule,
  ],
  exports: [SafeSortComponent],
})
export class SafeSortModule {}
