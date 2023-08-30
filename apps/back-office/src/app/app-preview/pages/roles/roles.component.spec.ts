import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SafeRolesModule } from '@oort-front/safe';
import { RolesComponent } from './roles.component';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { ApolloTestingModule } from 'apollo-angular/testing';
import {
  OAuthService,
  UrlHelperService,
  OAuthLogger,
  DateTimeProvider,
} from 'angular-oauth2-oidc';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PureAbility } from '@casl/ability';
import { AppAbility } from '@oort-front/safe';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('RolesComponent', () => {
  let component: RolesComponent;
  let fixture: ComponentFixture<RolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RolesComponent],
      imports: [
        SafeRolesModule,
        ApolloTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      providers: [
        TranslateService,
        OAuthService,
        UrlHelperService,
        OAuthLogger,
        DateTimeProvider,
        AppAbility,
        PureAbility,
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
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
