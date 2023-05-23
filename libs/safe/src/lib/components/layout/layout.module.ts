import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeLayoutComponent } from './layout.component';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { SafeSearchMenuModule } from '../search-menu/search-menu.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { SafeDateModule } from '../../pipes/date/date.module';
import { SafeIconModule } from '../ui/icon/icon.module';
import {
  BreadcrumbsModule,
  DividerModule,
  TooltipModule,
  MenuModule,
  ButtonModule,
  IconModule,
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
    MatButtonModule,
    MatIconModule,
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
    SafeIconModule,
    ButtonModule,
    IconModule,
  ],
  exports: [SafeLayoutComponent],
})
export class SafeLayoutModule {}
