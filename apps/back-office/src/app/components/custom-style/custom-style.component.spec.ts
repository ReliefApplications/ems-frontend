import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { CustomStyleComponent } from './custom-style.component';
import {
  TranslateService,
  TranslateLoader,
  TranslateModule,
  TranslateFakeLoader,
} from '@ngx-translate/core';
import {
  OAuthService,
  UrlHelperService,
  OAuthLogger,
  DateTimeProvider,
} from 'angular-oauth2-oidc';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Ability } from '@casl/ability';
import { DialogModule } from '@angular/cdk/dialog';
import { NGX_MONACO_EDITOR_CONFIG } from 'ngx-monaco-editor-v2';

describe('CustomStyleComponent', () => {
  let component: CustomStyleComponent;
  let fixture: ComponentFixture<CustomStyleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CustomStyleComponent,
        ApolloTestingModule,
        HttpClientTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
        DialogModule,
      ],
      providers: [
        TranslateService,
        OAuthService,
        UrlHelperService,
        OAuthLogger,
        DateTimeProvider,
        Ability,
        { provide: 'environment', useValue: {} },
        { provide: NGX_MONACO_EDITOR_CONFIG, useValue: {} },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CustomStyleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
