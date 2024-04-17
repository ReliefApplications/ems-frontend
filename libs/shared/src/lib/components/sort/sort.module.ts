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
import { SharedSortComponent } from './sort.component';
import { SortRowComponent } from './sort-row/sort-row.component';

/**
 * Composite Sort module.
 */
@NgModule({
  declarations: [SortGroupComponent, SharedSortComponent, SortRowComponent],
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    SelectMenuModule,
    FormWrapperModule,
  ],
  exports: [SharedSortComponent],
})
export class SharedSortModule {}
