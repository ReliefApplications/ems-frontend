import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeApplicationTemplatesComponent } from './application-templates.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AppAbility } from '../../services/auth/auth.service';
import {
  DateTimeProvider,
  OAuthLogger,
  OAuthService,
  UrlHelperService,
} from 'angular-oauth2-oidc';
import { SpinnerModule } from '@oort-front/ui';

describe('SafeApplicationTemplatesComponent', () => {
  let component: SafeApplicationTemplatesComponent;
  let fixture: ComponentFixture<SafeApplicationTemplatesComponent>;

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
      ],
      declarations: [SafeApplicationTemplatesComponent],
      imports: [
        ApolloTestingModule,
        HttpClientModule,
        SpinnerModule,
        TranslateModule.forRoot(),
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeApplicationTemplatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
