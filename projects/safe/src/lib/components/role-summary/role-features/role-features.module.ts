import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RoleFeaturesComponent } from './role-features.component';
import { RoleDashboardsComponent } from './role-dashboards/role-dashboards.component';
import { RoleFormsComponent } from './role-forms/role-forms.component';
import { RoleWorkflowsComponent } from './role-workflows/role-workflows.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatTableModule } from '@angular/material/table';
import { SafeButtonModule } from '../../ui/button/button.module';
import { SafeIconModule } from '../../ui/icon/icon.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
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
    MatTooltipModule,
    MatTableModule,
    SafeButtonModule,
    SafeIconModule,
    SafeEmptyModule,
  ],
  exports: [RoleFeaturesComponent],
})
export class RoleFeaturesModule {}
