import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SafeLeftSidenavComponent } from './left-sidenav.component';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { IconModule } from '@oort-front/ui';
import { MatSidenavModule } from '@angular/material/sidenav';
import { TooltipModule } from '@oort-front/ui';
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
    MatSidenavModule,
    TooltipModule,
    RouterModule,
    SafeButtonModule,
    SafeDividerModule,
    TranslateModule,
    IconModule,
  ],
  exports: [SafeLeftSidenavComponent],
})
export class SafeLeftSidenavModule {}
