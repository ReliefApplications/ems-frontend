import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapLayersComponent } from './map-layers.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
// import { MapMarkersModule } from './map-markers/map-markers.module';
// import { MapClorophletsModule } from './map-clorophlets/map-clorophlets.module';
// import { MapOnlineLayersModule } from './map-online-layers/map-online-layers.module';
import { SafeButtonModule } from '../../../ui/button/button.module';
import { MatTableModule } from '@angular/material/table';
import { SafeEditLayerModalModule } from './edit-layer-modal/edit-layer-modal.module';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { SafeDividerModule } from '../../../ui/divider/divider.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SafeLayerTableModule } from './layer-table/layer-table.module';

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
    // MatTabsModule,
    // MapMarkersModule,
    // MapClorophletsModule,
    // MapOnlineLayersModule,
    SafeButtonModule,
    MatTableModule,
    SafeEditLayerModalModule,
    SafeLayerTableModule,
    MatMenuModule,
    MatIconModule,
    SafeDividerModule,
    DragDropModule,
  ],
  exports: [MapLayersComponent],
})
export class MapLayersModule {}
