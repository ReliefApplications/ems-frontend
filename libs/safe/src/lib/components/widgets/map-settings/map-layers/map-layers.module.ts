import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapLayersComponent } from './map-layers.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  ButtonModule,
  DividerModule,
  IconModule,
  MenuModule,
  TableModule,
  TabsModule,
} from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SafeEmptyModule } from '../../../ui/empty/empty.module';
import { SafeSkeletonTableModule } from '../../../skeleton/skeleton-table/skeleton-table.module';

/**
 * Map Widget layers configuration module.
 */
@NgModule({
  declarations: [MapLayersComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    ButtonModule,
    TableModule,
    MenuModule,
    IconModule,
    DividerModule,
    DragDropModule,
    TabsModule,
    SafeEmptyModule,
    SafeSkeletonTableModule,
  ],
  exports: [MapLayersComponent],
})
export class MapLayersModule {}
