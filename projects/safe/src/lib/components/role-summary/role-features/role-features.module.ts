import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleFeaturesComponent } from './role-features.component';
import { RoleDashboardsComponent } from './role-dashboards/role-dashboards.component';
import { RoleFormsComponent } from './role-forms/role-forms.component';
import { RoleWorkflowsComponent } from './role-workflows/role-workflows.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatTableModule } from '@angular/material/table';
import { SafeButtonModule } from '../../ui/button/button.module';

/**
 * Features tab of Role Summary component.
 * Visible only in applications.
 */
@NgModule({
  declarations: [
    RoleFeaturesComponent,
    RoleDashboardsComponent,
    RoleFormsComponent,
    RoleWorkflowsComponent,
  ],
  imports: [CommonModule, TranslateModule, MatTableModule, SafeButtonModule],
  exports: [RoleFeaturesComponent],
})
export class RoleFeaturesModule {}
