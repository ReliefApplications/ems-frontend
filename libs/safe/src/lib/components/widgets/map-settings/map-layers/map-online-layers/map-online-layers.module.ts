import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapOnlineLayersComponent } from './map-online-layers.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { SafeButtonModule } from '../../../../ui/button/button.module';
import { SafeBadgeModule } from '../../../../ui/badge/badge.module';
import { SafeAlertModule } from '../../../../ui/alert/alert.module';
import { SafeIconModule } from '../../../../ui/icon/icon.module';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';

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
    SafeButtonModule,
    SafeBadgeModule,
    SafeAlertModule,
    SafeIconModule,
    MatTableModule,
  ],
  exports: [MapOnlineLayersComponent],
})
export class MapOnlineLayersModule {}
