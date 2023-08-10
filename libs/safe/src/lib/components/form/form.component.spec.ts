import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  DialogModule as DialogCdkModule,
  DialogRef,
  DIALOG_DATA,
} from '@angular/cdk/dialog';
import { SafeFormComponent } from './form.component';
import { HttpClientModule } from '@angular/common/http';
import {
  DateTimeProvider,
  OAuthLogger,
  OAuthService,
  UrlHelperService,
} from 'angular-oauth2-oidc';
import { RouterTestingModule } from '@angular/router/testing';
import {
  TranslateModule,
  TranslateService,
  TranslateFakeLoader,
  TranslateLoader,
} from '@ngx-translate/core';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { AppAbility } from '../../services/auth/auth.service';
import { SafeRecordSummaryModule } from '../record-summary/record-summary.module';
import { SafeFormActionsModule } from '../form-actions/form-actions.module';
import { ButtonModule, TabsModule } from '@oort-front/ui';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('SafeFormComponent', () => {
  let component: SafeFormComponent;
  let fixture: ComponentFixture<SafeFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        { provide: 'environment', useValue: {} },
        { provide: DialogRef, useValue: {} },
        {
          provide: DIALOG_DATA,
          useValue: {
            access: { canSee: null, canUpdate: null, canDelete: null },
          },
        },
        OAuthService,
        UrlHelperService,
        OAuthLogger,
        DateTimeProvider,
        TranslateService,
        AppAbility,
      ],
      declarations: [SafeFormComponent],
      imports: [
        DialogCdkModule,
        HttpClientModule,
        ApolloTestingModule,
        RouterTestingModule,
        SafeRecordSummaryModule,
        SafeFormActionsModule,
        TabsModule,
        ButtonModule,
        BrowserAnimationsModule,
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
    fixture = TestBed.createComponent(SafeFormComponent);
    component = fixture.componentInstance;
    component.form = {
      structure: '{}',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
