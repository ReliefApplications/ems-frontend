import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeLayerTableComponent } from './layer-table.component';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafeDividerModule } from '../../../../ui/divider/divider.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SafeButtonModule } from '../../../../ui/button/button.module';
import { MatMenuModule } from '@angular/material/menu';
import { TranslateModule } from '@ngx-translate/core';

/**
 *
 */
@NgModule({
  declarations: [SafeLayerTableComponent],
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    SafeDividerModule,
    DragDropModule,
    SafeButtonModule,
    MatMenuModule,
    TranslateModule,
  ],
  exports: [SafeLayerTableComponent],
})
export class SafeLayerTableModule {}
