import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { SafeLayerDatasourceComponent } from './layer-datasource.component';
import { SafeButtonModule } from 'projects/safe/src/lib/components/ui/button/button.module';

/** Module for the SafeLayerDatasourceComponent */
@NgModule({
  declarations: [SafeLayerDatasourceComponent],
  imports: [CommonModule, TranslateModule, SafeButtonModule],
  exports: [SafeLayerDatasourceComponent],
})
export class SafeLayerDatasourceModule {}
