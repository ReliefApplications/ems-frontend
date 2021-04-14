import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { PositionAttributesRoutingModule } from './position-attributes-routing.module';
import { PositionAttributesComponent } from './position-attributes.component';
import { SafePreviousButtonModule } from '@safe/builder';

@NgModule({
  declarations: [
    PositionAttributesComponent,
  ],
  imports: [
    CommonModule,
    PositionAttributesRoutingModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    SafePreviousButtonModule
  ],
  exports: [PositionAttributesComponent]
})
export class PositionAttributesModule { }
