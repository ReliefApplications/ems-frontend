import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoleFeaturesComponent } from './role-features.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { FormWrapperModule, IconModule } from '@oort-front/ui';
import { RoleDashboardsComponent } from './role-dashboards/role-dashboards.component';
import { RoleFormsComponent } from './role-forms/role-forms.component';
import { RoleWorkflowsComponent } from './role-workflows/role-workflows.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SafeEmptyModule } from '../../ui/empty/empty.module';

describe('RoleFeaturesComponent', () => {
  let component: RoleFeaturesComponent;
  let fixture: ComponentFixture<RoleFeaturesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        RoleFeaturesComponent,
        RoleDashboardsComponent,
        RoleFormsComponent,
        RoleWorkflowsComponent,
      ],
      imports: [
        ApolloTestingModule,
        FormWrapperModule,
        HttpClientModule,
        TranslateModule.forRoot(),
        IconModule,
        FormsModule,
        ReactiveFormsModule,
        SafeEmptyModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleFeaturesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
