import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { LayoutModule, NavbarModule } from '@oort-front/shared';
import { DialogModule } from '@oort-front/ui';
import { ManageItemSpecificTemplatesModalComponent } from './pages/manage-item-specific-templates-modal/manage-item-specific-templates-modal.component';

/**
 * Main BO dashboard module.
 */
@NgModule({
  declarations: [DashboardComponent, ManageItemSpecificTemplatesModalComponent],
  imports: [
    CommonModule,
    LayoutModule,
    DashboardRoutingModule,
    NavbarModule,
    DialogModule,
  ],
})
export class DashboardModule {}
