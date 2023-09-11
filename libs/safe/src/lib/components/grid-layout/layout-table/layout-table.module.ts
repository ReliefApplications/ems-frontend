import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutTableComponent } from './layout-table.component';
import { DividerModule, IconModule } from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SafeDateModule } from '../../../pipes/date/date.module';
import { MenuModule, ButtonModule, TableModule } from '@oort-front/ui';

/** Module for layout component in grid widget settings */
@NgModule({
  declarations: [LayoutTableComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MenuModule,
    IconModule,
    DragDropModule,
    SafeDateModule,
    ButtonModule,
    TableModule,
    DividerModule,
  ],
  exports: [LayoutTableComponent],
})
export class LayoutTableModule {}
