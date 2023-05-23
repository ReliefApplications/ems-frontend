import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleFeaturesComponent } from './role-features.component';
import { RoleDashboardsComponent } from './role-dashboards/role-dashboards.component';
import { RoleFormsComponent } from './role-forms/role-forms.component';
import { RoleWorkflowsComponent } from './role-workflows/role-workflows.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatLegacyTableModule as MatTableModule } from '@angular/material/legacy-table';
import { SafeIconModule } from '../../ui/icon/icon.module';
import { MatLegacyFormFieldModule as MatFormFieldModule } from '@angular/material/legacy-form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatLegacyInputModule as MatInputModule } from '@angular/material/legacy-input';
import { MatIconModule } from '@angular/material/icon';
import { TooltipModule, ButtonModule } from '@oort-front/ui';
import { SafeEmptyModule } from '../../ui/empty/empty.module';

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
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    TooltipModule,
    MatTableModule,
    SafeIconModule,
    SafeEmptyModule,
    ButtonModule,
  ],
  exports: [RoleFeaturesComponent],
})
export class RoleFeaturesModule {}
