import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { SearchMenuModule } from '../search-menu/search-menu.module';
import { LanguageSwitchComponent } from '../language-switch/language-switch.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { NotificationIconComponent } from './components/notification-icon/notification-icon.component';
import {
  BreadcrumbsModule,
  DividerModule,
  TooltipModule,
  MenuModule,
  ButtonModule,
  SidenavContainerModule,
} from '@oort-front/ui';

/**
 * LayoutModule is a class used to manage all the modules and components
 * related to the main layout of the platform.
 */
@NgModule({
  declarations: [LayoutComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MenuModule,
    SidenavContainerModule,
    DragDropModule,
    TooltipModule,
    DividerModule,
    TranslateModule,
    SearchMenuModule,
    LanguageSwitchComponent,
    OverlayModule,
    BreadcrumbsModule,
    ButtonModule,
    NotificationIconComponent,
  ],
  exports: [LayoutComponent],
})
export class LayoutModule {}
