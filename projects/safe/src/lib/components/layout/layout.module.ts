import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeLayoutComponent } from './layout.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SafeButtonModule } from '../ui/button/button.module';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { SafeSearchMenuModule } from '../search-menu/search-menu.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { SafePreferencesModalModule } from '../preferences-modal/preferences-modal.module';
import { SafeDateModule } from '../../pipes/date/date.module';
import { SafeBreadcrumbModule } from '../ui/breadcrumb/breadcrumb.module';
import { SafeDividerModule } from '../ui/divider/divider.module';

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
    MatMenuModule,
    MatSidenavModule,
    MatListModule,
    DragDropModule,
    SafeDividerModule,
    MatTooltipModule,
    SafeButtonModule,
    IndicatorsModule,
    TranslateModule,
    SafeSearchMenuModule,
    OverlayModule,
    SafePreferencesModalModule,
    SafeDateModule,
    SafeBreadcrumbModule,
  ],
  exports: [SafeLayoutComponent],
})
export class SafeLayoutModule {}
