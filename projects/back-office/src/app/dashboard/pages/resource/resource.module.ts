import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceRoutingModule } from './resource-routing.module';
import { ResourceComponent } from './resource.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import {
  SafeAccessModule,
  SafeButtonModule,
  SafeDateModule,
  SafeConfirmModalModule,
} from '@safe/builder';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
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
    SafeConfirmModalModule,
  ],
  exports: [ResourceComponent],
})
export class ResourceModule {}
