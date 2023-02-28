import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutTableComponent } from './layout-table.component';
import { SafeButtonModule } from '../../ui/button/button.module';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { TranslateModule } from '@ngx-translate/core';
import { AddLayoutModalModule } from '../add-layout-modal/add-layout-modal.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SafeEditLayoutModalModule } from '../edit-layout-modal/edit-layout-modal.module';
import { SafeDateModule } from '../../../pipes/date/date.module';

/** Module for layout component in grid widget settings */
@NgModule({
  declarations: [LayoutTableComponent],
  imports: [
    CommonModule,
    TranslateModule,
    MatTableModule,
    MatMenuModule,
    MatIconModule,
    DragDropModule,
    SafeButtonModule,
    AddLayoutModalModule,
    SafeEditLayoutModalModule,
    SafeDateModule,
  ],
  exports: [LayoutTableComponent],
})
export class LayoutTableModule {}
