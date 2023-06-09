import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapOnlineLayersComponent } from './map-online-layers.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { SafeBadgeModule } from '../../../../ui/badge/badge.module';
import {
  AlertModule,
  ButtonModule,
  TableModule,
  FormWrapperModule,
} from '@oort-front/ui';

/**
 * Online Layers configuration of Map Widget Module.
 */
@NgModule({
  declarations: [MapOnlineLayersComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    FormWrapperModule,
    SafeBadgeModule,
    TableModule,
    ButtonModule,
    AlertModule,
  ],
  exports: [MapOnlineLayersComponent],
})
export class MapOnlineLayersModule {}
