import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SafeLeftSidenavComponent } from './left-sidenav.component';
import { RouterModule } from '@angular/router';
import {
  TooltipModule,
  DividerModule,
  ButtonModule,
  IconModule,
} from '@oort-front/ui';
import { TranslateModule } from '@ngx-translate/core';

/**
 * Left Sidenav Module
 */
@NgModule({
  declarations: [SafeLeftSidenavComponent],
  imports: [
    CommonModule,
    DragDropModule,
    TooltipModule,
    RouterModule,
    DividerModule,
    TranslateModule,
    ButtonModule,
    IconModule,
  ],
  exports: [SafeLeftSidenavComponent],
})
export class SafeLeftSidenavModule {}
