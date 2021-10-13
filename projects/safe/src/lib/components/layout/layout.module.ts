import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeLayoutComponent } from './layout.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatDividerModule } from '@angular/material/divider';
import { SafeConfirmModalModule } from '../confirm-modal/confirm-modal.module';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SafeButtonModule } from '../ui/button/button.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { IndicatorsModule } from "@progress/kendo-angular-indicators";

@NgModule({
  declarations: [SafeLayoutComponent],
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
    MatDividerModule,
    SafeConfirmModalModule,
    MatTooltipModule,
    SafeButtonModule,
    MatPaginatorModule,
    IndicatorsModule
  ],
  exports: [SafeLayoutComponent]
})
export class SafeLayoutModule { }
