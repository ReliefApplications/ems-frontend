import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutComponent } from './layout.component';
import { IconModule } from '@oort-front/ui';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { SearchMenuModule } from '../search-menu/search-menu.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { DateModule } from '../../pipes/date/date.module';
import {
  BreadcrumbsModule,
  DividerModule,
  TooltipModule,
  MenuModule,
  ButtonModule,
  SidenavContainerModule,
} from '@oort-front/ui';
import { ApplicationToolbarModule } from '../application-toolbar/application-toolbar.module';

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
    IndicatorsModule,
    TranslateModule,
    SearchMenuModule,
    OverlayModule,
    DateModule,
    BreadcrumbsModule,
    ButtonModule,
    IconModule,
    ApplicationToolbarModule,
  ],
  exports: [LayoutComponent],
})
export class LayoutModule {}
