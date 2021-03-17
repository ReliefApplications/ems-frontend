import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhoWidgetGridComponent } from './widget-grid.component';
import { WhoWidgetModule } from '../widget/widget.module';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { WhoFloatingOptionsComponent } from './floating-options/floating-options.component';
import { WhoTileDataComponent } from './floating-options/menu/tile-data/tile-data.component';
import { WhoTileDisplayComponent } from './floating-options/menu/tile-display/tile-display.component';
import { WhoExpandedWidgetComponent } from './expanded-widget/expanded-widget.component';
import {WhoDashboardMenuComponent} from './dashboard-menu/dashboard-menu.component';


@NgModule({
  declarations: [
    WhoWidgetGridComponent,
    WhoFloatingOptionsComponent,
    WhoDashboardMenuComponent,
    WhoTileDataComponent,
    WhoTileDisplayComponent,
    WhoExpandedWidgetComponent
  ],
  imports: [
    CommonModule,
    WhoWidgetModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatDialogModule,
    MatGridListModule,
    MatTooltipModule,
    MatDialogModule,
    MatMenuModule,
    DragDropModule
  ],
  exports: [WhoWidgetGridComponent]
})
export class WhoWidgetGridModule { }
