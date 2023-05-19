import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceRoutingModule } from './resource-routing.module';
import { ResourceComponent } from './resource.component';
import { MatLegacyProgressSpinnerModule as MatProgressSpinnerModule } from '@angular/material/legacy-progress-spinner';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { MatIconModule } from '@angular/material/icon';
import { MenuModule } from '@oort-front/ui';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import {
  SafeAccessModule,
  SafeButtonModule,
  SafeDateModule,
} from '@oort-front/safe';
import { MatLegacyPaginatorModule as MatPaginatorModule } from '@angular/material/legacy-paginator';
import { TranslateModule } from '@ngx-translate/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { UploadMenuModule } from '../../../components/upload-menu/upload-menu.module';
import { TabsModule } from '@oort-front/ui';

/** Resource page module. */
@NgModule({
  declarations: [ResourceComponent],
  imports: [
    CommonModule,
    ResourceRoutingModule,
    MatProgressSpinnerModule,
    TabsModule,
    MatTableModule,
    MatIconModule,
    MenuModule,
    MatChipsModule,
    SafeAccessModule,
    SafeButtonModule,
    MatPaginatorModule,
    TranslateModule,
    OverlayModule,
    UploadMenuModule,
    SafeDateModule,
  ],
  exports: [ResourceComponent],
})
export class ResourceModule {}
