import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoleResourcesComponent } from './role-resources.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { SafeRoleResourceFiltersComponent } from './resource-access-filters/resource-access-filters.component';
import { ButtonModule, IconModule, PaginatorModule } from '@oort-front/ui';
import { FilterComponent } from '../role-resources-filter/role-resources-filter.component';
import { ResourceFieldsComponent } from './resource-fields/resource-fields.component';
import { SafeSkeletonTableModule } from '../../skeleton/skeleton-table/skeleton-table.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('RoleResourcesComponent', () => {
  let component: RoleResourcesComponent;
  let fixture: ComponentFixture<RoleResourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        RoleResourcesComponent,
        FilterComponent,
        ResourceFieldsComponent,
        SafeRoleResourceFiltersComponent,
      ],
      imports: [
        ApolloTestingModule,
        HttpClientModule,
        PaginatorModule,
        TranslateModule.forRoot(),
        IconModule,
        ButtonModule,
        SafeSkeletonTableModule,
        FormsModule,
        ReactiveFormsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleResourcesComponent);
    component = fixture.componentInstance;
    component.role = {};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
