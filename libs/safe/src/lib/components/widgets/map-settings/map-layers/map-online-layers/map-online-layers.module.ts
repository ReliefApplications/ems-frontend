import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapOnlineLayersComponent } from './map-online-layers.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { SafeBadgeModule } from '../../../../ui/badge/badge.module';
import { SafeAlertModule } from '../../../../ui/alert/alert.module';
import { SafeIconModule } from '../../../../ui/icon/icon.module';
import { TableModule } from '@oort-front/ui';
import { ButtonModule } from '@oort-front/ui';

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
    MatFormFieldModule,
    MatInputModule,
    SafeBadgeModule,
    SafeAlertModule,
    SafeIconModule,
    TableModule,
    ButtonModule,
  ],
  exports: [MapOnlineLayersComponent],
})
export class MapOnlineLayersModule {}
