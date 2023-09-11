import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { AppPreviewComponent } from './app-preview.component';
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
import { SafeLayoutModule } from '@oort-front/safe';
import { DialogModule } from '@angular/cdk/dialog';
import { AppPreviewModule } from './app-preview.module';

describe('AppPreviewComponent', () => {
  let component: AppPreviewComponent;
  let fixture: ComponentFixture<AppPreviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppPreviewComponent],
      providers: [
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
        SafeLayoutModule,
        DialogModule,
        AppPreviewModule,
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
    fixture = TestBed.createComponent(AppPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
