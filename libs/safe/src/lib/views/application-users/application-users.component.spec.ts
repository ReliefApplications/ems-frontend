import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeApplicationUsersComponent } from './application-users.component';
import { Dialog, DialogModule as DialogCdkModule } from '@angular/cdk/dialog';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  DateTimeProvider,
  OAuthLogger,
  OAuthService,
  UrlHelperService,
} from 'angular-oauth2-oidc';
import { AppAbility } from '../../services/auth/auth.service';
import { ButtonModule, MenuModule, TabsModule } from '@oort-front/ui';
import { UserListModule } from './components/user-list/user-list.module';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SafeApplicationUsersComponent', () => {
  let component: SafeApplicationUsersComponent;
  let fixture: ComponentFixture<SafeApplicationUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        Dialog,
        { provide: 'environment', useValue: {} },
        TranslateService,
        OAuthService,
        UrlHelperService,
        OAuthLogger,
        DateTimeProvider,
        AppAbility,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
          },
        },
      ],
      declarations: [SafeApplicationUsersComponent],
      imports: [
        DialogCdkModule,
        BrowserAnimationsModule,
        ApolloTestingModule,
        HttpClientModule,
        ButtonModule,
        MenuModule,
        TabsModule,
        UserListModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeApplicationUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
