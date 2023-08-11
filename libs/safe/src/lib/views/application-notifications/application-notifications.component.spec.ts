import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationsModule } from '../../components/notifications/notifications.module';
import { SafeApplicationNotificationsComponent } from './application-notifications.component';
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

describe('SafeApplicationNotificationsComponent', () => {
  let component: SafeApplicationNotificationsComponent;
  let fixture: ComponentFixture<SafeApplicationNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        TranslateService,
        { provide: 'environment', useValue: {} },
        OAuthService,
        UrlHelperService,
        OAuthLogger,
        DateTimeProvider,
        AppAbility,
      ],
      declarations: [SafeApplicationNotificationsComponent],
      imports: [
        ApolloTestingModule,
        TranslateModule.forRoot(),
        HttpClientModule,
        NotificationsModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeApplicationNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
