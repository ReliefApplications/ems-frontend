import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeLayoutComponent } from './layout.component';
import { IconModule } from '@oort-front/ui';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { SafeSearchMenuModule } from '../search-menu/search-menu.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { SafeDateModule } from '../../pipes/date/date.module';
import {
  BreadcrumbsModule,
  DividerModule,
  TooltipModule,
  MenuModule,
  ButtonModule,
  SidenavContainerModule,
} from '@oort-front/ui';

/**
 * SafeLayoutModule is a class used to manage all the modules and components
 * related to the main layout of the platform.
 */
@NgModule({
  declarations: [SafeLayoutComponent],
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
    SafeSearchMenuModule,
    OverlayModule,
    SafeDateModule,
    BreadcrumbsModule,
    ButtonModule,
    IconModule,
  ],
  exports: [SafeLayoutComponent],
})
export class SafeLayoutModule {}
