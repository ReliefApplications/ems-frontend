import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { NavbarComponent } from './navbar.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  ButtonModule,
  DividerModule,
  IconModule,
  TooltipModule,
} from '@oort-front/ui';
import { LocalizePipe } from '../../pipes/localize/localize.pipe';

/**
 * Left Sidenav Module
 */
@NgModule({
  declarations: [NavbarComponent],
  imports: [
    CommonModule,
    DragDropModule,
    RouterModule,
    TranslateModule,
    TooltipModule,
    ButtonModule,
    IconModule,
    DividerModule,
    LocalizePipe,
  ],
  exports: [NavbarComponent],
})
export class NavbarModule {}
