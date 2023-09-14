import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RoleUsersComponent } from './role-users.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';
import { SafeSkeletonTableModule } from '../../skeleton/skeleton-table/skeleton-table.module';
import { TranslateModule } from '@ngx-translate/core';

describe('RoleUsersComponent', () => {
  let component: RoleUsersComponent;
  let fixture: ComponentFixture<RoleUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoleUsersComponent],
      imports: [
        ApolloTestingModule,
        HttpClientModule,
        SafeSkeletonTableModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleUsersComponent);
    component = fixture.componentInstance;
    component.role = { id: '' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
