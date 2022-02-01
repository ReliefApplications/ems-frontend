import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourceLayoutsComponent } from './resource-layouts.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { SafeButtonModule } from '@safe/builder';

@NgModule({
  declarations: [ResourceLayoutsComponent],
  imports: [
    CommonModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatTableModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    SafeButtonModule,
    MatTooltipModule,
    MatPaginatorModule,
    TranslateModule,
  ],
  exports: [ResourceLayoutsComponent],
})
export class ResourceLayoutsModule {}
