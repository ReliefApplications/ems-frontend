import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  DialogModule as DialogCdkModule,
  DialogRef,
  DIALOG_DATA,
} from '@angular/cdk/dialog';
import { SafeRolesComponent } from './roles.component';
import { HttpClientModule } from '@angular/common/http';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import {
  ApolloTestingModule,
  ApolloTestingController,
} from 'apollo-angular/testing';
import { GET_ROLES } from './graphql/queries';
import { AbilityModule } from '@casl/angular';
import { TabsModule } from '@oort-front/ui';
import { SafeRoleListModule } from './components/role-list/role-list.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppAbility } from '../../services/auth/auth.service';
import { OAuthModule } from 'angular-oauth2-oidc';
import { PureAbility } from '@casl/ability';

describe('SafeRolesComponent', () => {
  let component: SafeRolesComponent;
  let fixture: ComponentFixture<SafeRolesComponent>;
  let controller: ApolloTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: DialogRef, useValue: {} },
        { provide: DIALOG_DATA, useValue: {} },
        { provide: 'environment', useValue: {} },
        AppAbility,
        PureAbility,
      ],
      declarations: [SafeRolesComponent],
      imports: [
        OAuthModule.forRoot(),
        DialogCdkModule,
        HttpClientModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        TabsModule,
        SafeRoleListModule,
        AbilityModule,
        TranslateModule.forRoot(),
        ApolloTestingModule,
      ],
    }).compileComponents();

    controller = TestBed.inject(ApolloTestingController);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const op = controller.expectOne(GET_ROLES);

    op.flush({
      data: {
        roles: {
          id: '',
          title: '',
          users: {
            totalCount: '',
          },
        },
      },
    });
  });

  afterEach(() => {
    controller.verify();
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
