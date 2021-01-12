import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhoQueryBuilderComponent } from './query-builder.component';
import { MatTabsModule } from '@angular/material/tabs';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { WhoTabFieldsComponent } from './tab-fields/tab-fields.component';
import { WhoTabSortComponent } from './tab-sort/tab-sort.component';
import { WhoTabFilterComponent } from './tab-filter/tab-filter.component';

@NgModule({
  declarations: [
    WhoQueryBuilderComponent,
    WhoTabFieldsComponent,
    WhoTabSortComponent,
    WhoTabFilterComponent
  ],
  imports: [
    CommonModule,
    MatTabsModule,
    DragDropModule
  ],
  exports: [WhoQueryBuilderComponent]
})
export class WhoQueryBuilderModule { }
