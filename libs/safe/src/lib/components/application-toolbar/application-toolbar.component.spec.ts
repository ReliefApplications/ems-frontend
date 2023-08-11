import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeApplicationToolbarComponent } from './application-toolbar.component';
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
import { Dialog, DialogModule } from '@angular/cdk/dialog';
import { MenuModule } from '@oort-front/ui';

describe('ApplicationToolbarComponent', () => {
  let component: SafeApplicationToolbarComponent;
  let fixture: ComponentFixture<SafeApplicationToolbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: 'environment', useValue: {} },
        TranslateService,
        OAuthService,
        UrlHelperService,
        OAuthLogger,
        DateTimeProvider,
        AppAbility,
        Dialog,
      ],
      declarations: [SafeApplicationToolbarComponent],
      imports: [
        ApolloTestingModule,
        HttpClientModule,
        TranslateModule.forRoot(),
        DialogModule,
        MenuModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeApplicationToolbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
