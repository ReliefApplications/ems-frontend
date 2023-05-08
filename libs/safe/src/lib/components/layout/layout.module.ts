import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SafeLayoutComponent } from './layout.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { MatIconModule } from '@angular/material/icon';
import { MatLegacyMenuModule as MatMenuModule } from '@angular/material/legacy-menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatLegacyListModule as MatListModule } from '@angular/material/legacy-list';
import { RouterModule } from '@angular/router';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatLegacyTooltipModule as MatTooltipModule } from '@angular/material/legacy-tooltip';
import { SafeButtonModule } from '../ui/button/button.module';
import { IndicatorsModule } from '@progress/kendo-angular-indicators';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { SafeSearchMenuModule } from '../search-menu/search-menu.module';
import { OverlayModule } from '@angular/cdk/overlay';
import { SafeDateModule } from '../../pipes/date/date.module';
import { BreadcrumbsModule } from '@oort-front/ui';
import { SafeDividerModule } from '../ui/divider/divider.module';
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
    SafeDateModule,
    BreadcrumbsModule,
    SafeIconModule,
  ],
  exports: [SafeLayoutComponent],
})
export class SafeLayoutModule {}
