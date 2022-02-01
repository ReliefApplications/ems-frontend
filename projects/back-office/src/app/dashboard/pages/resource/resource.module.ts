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
  SafePreviousButtonModule,
  SafeButtonModule,
} from '@safe/builder';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule } from '@angular/material/paginator';
import { TranslateModule } from '@ngx-translate/core';
import { ResourceRecordsModule } from './resource-records/resource-records.module';
import { ResourceFormsModule } from './resource-forms/resource-forms.module';
import { ResourceLayoutsModule } from './resource-layouts/resource-layouts.module';

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
    SafePreviousButtonModule,
    SafeButtonModule,
    MatTooltipModule,
    MatPaginatorModule,
    TranslateModule,
    ResourceRecordsModule,
    ResourceFormsModule,
    ResourceLayoutsModule,
  ],
  exports: [ResourceComponent],
})
export class ResourceModule {}
