import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { UserSummaryComponent } from './user-summary.component';
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
import { Ability } from '@casl/ability';

describe('UserSummaryComponent', () => {
  let component: UserSummaryComponent;
  let fixture: ComponentFixture<UserSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UserSummaryComponent],
      providers: [
        TranslateService,
        OAuthService,
        UrlHelperService,
        OAuthLogger,
        DateTimeProvider,
        Ability,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
          },
        },
        {
          provide: 'environment',
          useValue: {},
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
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
