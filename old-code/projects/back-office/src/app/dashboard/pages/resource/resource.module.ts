import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceRoutingModule } from './resource-routing.module';
import { ResourceComponent } from './resource.component';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyTabsModule as MatTabsModule } from '@angular/material/legacy-tabs';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import {
  SafeAccessModule,
  SafeButtonModule,
  SafeDateModule,
} from '@safe/builder';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { TranslateModule } from '@ngx-translate/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { UploadMenuModule } from '../../../components/upload-menu/upload-menu.module';

/** Resource page module. */
@NgModule({
  declarations: [ResourceComponent],
  imports: [
    CommonModule,
    ResourceRoutingModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatTableModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    SafeAccessModule,
    SafeButtonModule,
    MatTooltipModule,
    MatPaginatorModule,
    TranslateModule,
    OverlayModule,
    UploadMenuModule,
    SafeDateModule,
  ],
  exports: [ResourceComponent],
})
export class ResourceModule {}
