import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutTableComponent } from './layout-table.component';
import { SafeButtonModule } from '../../ui/button/button.module';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { TranslateModule } from '@ngx-translate/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SafeDateModule } from '../../../pipes/date/date.module';
import { IconModule } from '@oort-front/ui';

/** Module for layout component in grid widget settings */
@NgModule({
  declarations: [LayoutTableComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatTableModule,
    MatMenuModule,
    DragDropModule,
    SafeButtonModule,
    SafeDateModule,
    IconModule,
  ],
  exports: [LayoutTableComponent],
})
export class LayoutTableModule {}
