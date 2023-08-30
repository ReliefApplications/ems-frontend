import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RoleSummaryComponent } from './role-summary.component';
import { of } from 'rxjs';
import { ApolloTestingModule } from 'apollo-angular/testing';
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

describe('RoleSummaryComponent', () => {
  let component: RoleSummaryComponent;
  let fixture: ComponentFixture<RoleSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RoleSummaryComponent],
      providers: [
        TranslateService,
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
        {
          provide: 'environment',
          useValue: {
            availableLanguages: [],
            theme: {},
          },
        },
      ],
      imports: [
        ApolloTestingModule,
        HttpClientTestingModule,
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
    fixture = TestBed.createComponent(RoleSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
