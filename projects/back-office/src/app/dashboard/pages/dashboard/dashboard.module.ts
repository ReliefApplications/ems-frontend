import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { WhoAccessModule, WhoWidgetModule } from 'who-shared';
import { ShareUrlComponent } from './components/share-url/share-url.component';
import { FloatingMenuComponent } from './components/floating-menu/floating-menu.component';
import { FloatingOptionsComponent } from './components/floating-options/floating-options.component';
import { TileDataComponent } from './components/floating-options/menu/tile-data/tile-data.component';
import { TileDisplayComponent } from './components/floating-options/menu/tile-display/tile-display.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@NgModule({
  declarations: [
    DashboardComponent,
    ShareUrlComponent,
    FloatingMenuComponent,
    FloatingOptionsComponent,
    TileDataComponent,
    TileDisplayComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    WhoWidgetModule,
    WhoAccessModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDialogModule,
    MatGridListModule,
    MatTooltipModule,
    MatMenuModule,
    DragDropModule,
    ClipboardModule,
  ],
  exports: [DashboardComponent]
})
export class DashboardModule { }
