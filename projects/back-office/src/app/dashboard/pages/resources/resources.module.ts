import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ResourcesRoutingModule } from './resources-routing.module';
import { ResourcesComponent } from './resources.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  declarations: [ResourcesComponent],
  imports: [
    CommonModule,
    ResourcesRoutingModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatIconModule,
    MatDialogModule
  ],
  exports: [ResourcesComponent]
})
export class ResourcesModule { }
