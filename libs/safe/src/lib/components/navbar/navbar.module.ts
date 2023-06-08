import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SafeNavbarComponent } from './navbar.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  DividerModule,
  IconModule,
  TooltipModule,
} from '@oort-front/ui';

/**
 * Left Sidenav Module
 */
@NgModule({
  declarations: [SafeNavbarComponent],
  imports: [
    CommonModule,
    DragDropModule,
    RouterModule,
    TranslateModule,
    TooltipModule,
    ButtonModule,
    IconModule,
    DividerModule,
  ],
  exports: [SafeNavbarComponent],
})
export class SafeNavbarModule {}
