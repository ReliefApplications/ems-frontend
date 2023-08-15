import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import {
  OAuthService,
  UrlHelperService,
  OAuthLogger,
  DateTimeProvider,
} from 'angular-oauth2-oidc';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AppAbility } from '@oort-front/safe';
import { DialogModule } from '@angular/cdk/dialog';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ApolloTestingModule,
        HttpClientTestingModule,
        DialogModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      declarations: [AppComponent],
      providers: [
        OAuthService,
        UrlHelperService,
        OAuthLogger,
        DateTimeProvider,
        AppAbility,
        TranslateService,
        {
          provide: 'environment',
          useValue: {},
        },
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'back-office'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('back-office');
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('.content span').textContent).toContain(
      'back-office app is running!'
    );
  });
});
