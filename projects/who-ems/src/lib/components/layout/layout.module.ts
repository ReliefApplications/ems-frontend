import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WhoLayoutComponent } from './layout.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatBadgeModule } from '@angular/material/badge';
import { ApplicationModalComponent } from './application-modal/application-modal.component';
import {MatCardModule} from '@angular/material/card';
import {MatDialogModule} from '@angular/material/dialog';
import { FilterPipe } from './pipes/filter.pipe';
import { FormsModule } from '@angular/forms'; 

@NgModule({
  declarations: [WhoLayoutComponent, ApplicationModalComponent, FilterPipe],
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    DragDropModule,
    MatBadgeModule,
    MatCardModule,
    MatDialogModule,
    FormsModule
  ],
  exports: [WhoLayoutComponent]
})
export class WhoLayoutModule { }
