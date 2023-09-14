import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationsModule } from '../../components/notifications/notifications.module';
import { SafeApplicationNotificationsComponent } from './application-notifications.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule } from '@ngx-translate/core';
import { AppAbility } from '../../services/auth/auth.service';
import { OAuthModule } from 'angular-oauth2-oidc';

describe('SafeApplicationNotificationsComponent', () => {
  let component: SafeApplicationNotificationsComponent;
  let fixture: ComponentFixture<SafeApplicationNotificationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [{ provide: 'environment', useValue: {} }, AppAbility],
      declarations: [SafeApplicationNotificationsComponent],
      imports: [
        OAuthModule.forRoot(),
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
