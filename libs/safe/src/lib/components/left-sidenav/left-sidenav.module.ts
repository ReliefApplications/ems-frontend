import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SafeLeftSidenavComponent } from './left-sidenav.component';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { TooltipModule, DividerModule, ButtonModule } from '@oort-front/ui';
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
    TooltipModule,
    RouterModule,
    DividerModule,
    TranslateModule,
    ButtonModule,
  ],
  exports: [SafeLeftSidenavComponent],
})
export class SafeLeftSidenavModule {}
