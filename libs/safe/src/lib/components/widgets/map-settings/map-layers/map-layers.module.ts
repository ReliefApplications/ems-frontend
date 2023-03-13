import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapLayersComponent } from './map-layers.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SafeButtonModule } from '../../../ui/button/button.module';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { SafeEditLayerModalModule } from './edit-layer-modal/edit-layer-modal.module';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatIconModule } from '@angular/material/icon';
import { SafeDividerModule } from '../../../ui/divider/divider.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SafeGraphQLSelectModule } from '../../../graphql-select/public-api';
import { MatFormFieldModule } from '@angular/material/form-field';
import { SafeModalModule } from '../../../ui/modal/public-api';

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
    SafeButtonModule,
    MatTableModule,
    SafeEditLayerModalModule,
    MatMenuModule,
    MatIconModule,
    SafeDividerModule,
    DragDropModule,
    SafeGraphQLSelectModule,
    MatFormFieldModule,
    SafeModalModule,
  ],
  exports: [MapLayersComponent],
})
export class MapLayersModule {}
