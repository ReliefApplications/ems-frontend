import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import {
  DateTimeProvider,
  OAuthLogger,
  OAuthService,
  UrlHelperService,
} from 'angular-oauth2-oidc';
import {
  TranslateModule,
  TranslateService,
  TranslateFakeLoader,
  TranslateLoader,
} from '@ngx-translate/core';
import { SafeProfileComponent } from './profile.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { AppAbility } from '../../services/auth/auth.service';

describe('SafeProfileComponent', () => {
  let component: SafeProfileComponent;
  let fixture: ComponentFixture<SafeProfileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        OAuthService,
        UrlHelperService,
        OAuthLogger,
        DateTimeProvider,
        UntypedFormBuilder,
        TranslateService,
        { provide: 'environment', useValue: {} },
        AppAbility,
      ],
      declarations: [SafeProfileComponent],
      imports: [
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
        ApolloTestingModule,
        HttpClientModule,
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
