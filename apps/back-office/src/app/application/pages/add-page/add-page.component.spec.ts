import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { AddPageComponent } from './add-page.component';
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
import { DialogModule } from '@angular/cdk/dialog';
import { ContentChoiceModule } from '@oort-front/shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('AddPageComponent', () => {
  let component: AddPageComponent;
  let fixture: ComponentFixture<AddPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddPageComponent],
      imports: [
        ApolloTestingModule,
        HttpClientTestingModule,
        DialogModule,
        ContentChoiceModule,
        FormsModule,
        ReactiveFormsModule,
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
        {
          provide: 'environment',
          useValue: {},
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
