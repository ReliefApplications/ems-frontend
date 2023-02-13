import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SafeLeftSidenavComponent } from './left-sidenav.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { SafeButtonModule } from '../ui/button/button.module';
import { SafeDividerModule } from '../ui/divider/divider.module';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Left Sidenav Module
 */
@NgModule({
  declarations: [SafeLeftSidenavComponent],
  imports: [
    CommonModule,
    DragDropModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatTooltipModule,
    RouterModule,
    SafeButtonModule,
    SafeDividerModule,
    TranslateModule,
  ],
  exports: [SafeLeftSidenavComponent],
})
export class SafeLeftSidenavModule {}
