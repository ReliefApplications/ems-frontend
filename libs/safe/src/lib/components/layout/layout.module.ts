import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeLayoutComponent } from './layout.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { MenuModule } from '@oort-front/ui';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { TooltipModule } from '@oort-front/ui';
import { SafeButtonModule } from '../ui/button/button.module';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { SafeSearchMenuModule } from '../search-menu/search-menu.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { SafeDateModule } from '../../pipes/date/date.module';
import { SafeBreadcrumbModule } from '../ui/breadcrumb/breadcrumb.module';
import { DividerModule } from '@oort-front/ui';
import { SafeIconModule } from '../ui/icon/icon.module';

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
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MenuModule,
    MatSidenavModule,
    DragDropModule,
    TooltipModule,
    DividerModule,
    SafeButtonModule,
    IndicatorsModule,
    TranslateModule,
    SafeSearchMenuModule,
    OverlayModule,
    SafeDateModule,
    SafeBreadcrumbModule,
    SafeIconModule,
  ],
  exports: [SafeLayoutComponent],
})
export class SafeLayoutModule {}
