import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SafeLeftSidenavComponent } from './left-sidenav.component';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
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
