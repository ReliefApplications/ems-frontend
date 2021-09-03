import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResourceRoutingModule } from './resource-routing.module';
import { ResourceComponent } from './resource.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatChipsModule } from '@angular/material/chips';
import { SafeAccessModule, SafePreviousButtonModule } from '@safe/builder';
import {SafeButtonModule} from '../../../../../../safe/src/lib/components/ui/button/button.module';

@NgModule({
  declarations: [ResourceComponent],
  imports: [
    CommonModule,
    ResourceRoutingModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatChipsModule,
    SafeAccessModule,
    SafePreviousButtonModule,
    SafeButtonModule
  ],
  exports: [ResourceComponent]
})
export class ResourceModule { }
