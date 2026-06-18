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
import { AppAbility } from '@oort-front/shared';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { DialogModule } from '@angular/cdk/dialog';
import { LayoutModule } from '@oort-front/shared';
import { ApplicationToolbarModule } from '@oort-front/shared';
import { NavbarModule } from '@oort-front/shared';

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
          },
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
        LayoutModule,
        ApplicationToolbarModule,
        NavbarModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
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
