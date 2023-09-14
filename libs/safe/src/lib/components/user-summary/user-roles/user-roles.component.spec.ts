import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserRolesComponent } from './user-roles.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';
import { OAuthModule } from 'angular-oauth2-oidc';
import { TranslateModule } from '@ngx-translate/core';
import { AppAbility } from '../../../services/auth/auth.service';
import { UserAppRolesComponent } from './user-app-roles/user-app-roles.component';
import { GraphQLSelectModule, SelectMenuModule } from '@oort-front/ui';
import { UserBackRolesComponent } from './user-back-roles/user-back-roles.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('UserRolesComponent', () => {
  let component: UserRolesComponent;
  let fixture: ComponentFixture<UserRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: 'environment', useValue: {} }, AppAbility],
      declarations: [
        UserRolesComponent,
        UserAppRolesComponent,
        UserBackRolesComponent,
      ],
      imports: [
        OAuthModule.forRoot(),
        ApolloTestingModule,
        HttpClientModule,
        GraphQLSelectModule,
        FormsModule,
        ReactiveFormsModule,
        SelectMenuModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
