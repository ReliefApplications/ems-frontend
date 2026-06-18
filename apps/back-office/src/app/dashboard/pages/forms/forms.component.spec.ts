import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { FormsComponent } from './forms.component';
import { DialogModule } from '@angular/cdk/dialog';
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
import { AbilityModule } from '@casl/angular';
import { AppAbility } from '@oort-front/shared';
import { FilterComponent } from './components/filter/filter.component';
import { PureAbility } from '@casl/ability';
import { ButtonModule, IconModule, PaginatorModule } from '@oort-front/ui';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SkeletonTableModule } from '@oort-front/shared';

describe('FormsComponent', () => {
  let component: FormsComponent;
  let fixture: ComponentFixture<FormsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [FormsComponent, FilterComponent],
      imports: [
        ApolloTestingModule,
        DialogModule,
        HttpClientTestingModule,
        AbilityModule,
        ButtonModule,
        IconModule,
        PaginatorModule,
        FormsModule,
        ReactiveFormsModule,
        SkeletonTableModule,
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
          provide: 'environment',
          useValue: {},
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
