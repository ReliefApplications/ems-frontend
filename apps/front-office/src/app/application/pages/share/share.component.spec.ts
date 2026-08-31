import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ShareComponent } from './share.component';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { ApolloTestingModule } from 'apollo-angular/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OAuthModule } from 'angular-oauth2-oidc';

import { Ability } from '@casl/ability';

describe('ShareComponent', () => {
  let component: ShareComponent;
  let fixture: ComponentFixture<ShareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ShareComponent],
      providers: [
        Ability,
        TranslateService,
        {
          provide: 'environment',
          useValue: {},
        },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
          },
        },
      ],
      imports: [
        HttpClientTestingModule,
        OAuthModule.forRoot(),
        ApolloTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
