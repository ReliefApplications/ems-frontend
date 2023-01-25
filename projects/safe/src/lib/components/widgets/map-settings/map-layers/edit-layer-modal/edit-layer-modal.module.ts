import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeModalModule } from '../../../../ui/modal/modal.module';
import { SafeEditLayerModalComponent } from './edit-layer-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatTabsModule } from '@angular/material/tabs';
import { SafeIconModule } from '../../../../ui/icon/icon.module';
import { SafeLayerPropertiesModule } from './layer-properties/layer-properties.module';
import { SafeLayerDatasourceModule } from './layer-datasource/layer-datasource.module';

/** Module for the SafeEditLayerModalComponent */
@NgModule({
  declarations: [SafeEditLayerModalComponent],
  imports: [
    CommonModule,
    SafeModalModule,
    TranslateModule,
    MatTabsModule,
    SafeIconModule,
    SafeLayerPropertiesModule,
    SafeLayerDatasourceModule,
  ],
  exports: [SafeEditLayerModalComponent],
})
export class SafeEditLayerModalModule {}
