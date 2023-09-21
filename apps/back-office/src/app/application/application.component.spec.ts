import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { ApplicationComponent } from './application.component';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  OAuthService,
  UrlHelperService,
  OAuthLogger,
  DateTimeProvider,
} from 'angular-oauth2-oidc';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppAbility } from '@oort-front/safe';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { DialogModule } from '@angular/cdk/dialog';
import { SafeLayoutModule } from '@oort-front/safe';
import { SafeApplicationToolbarModule } from '@oort-front/safe';
import { SafeNavbarModule } from '@oort-front/safe';

describe('ApplicationComponent', () => {
  let component: ApplicationComponent;
  let fixture: ComponentFixture<ApplicationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        TranslateService,
        OAuthService,
        UrlHelperService,
        OAuthLogger,
        DateTimeProvider,
        AppAbility,
        {
          provide: 'environment',
          useValue: {
            availableLanguages: [],
            theme: {},
          } 
        },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
          },
        },
      ],
      declarations: [ApplicationComponent],
      imports: [
        ApolloTestingModule,
        HttpClientTestingModule,
        DialogModule,
        SafeLayoutModule,
        SafeApplicationToolbarModule,
        SafeNavbarModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
