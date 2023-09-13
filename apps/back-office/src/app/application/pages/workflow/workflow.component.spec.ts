import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WorkflowComponent } from './workflow.component';
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
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { DialogModule } from '@angular/cdk/dialog';
import {
  SafeAccessModule,
  SafeWorkflowStepperModule,
  SafeSkeletonModule,
  SafeEditableTextModule,
} from '@oort-front/safe';
import { WorkflowRoutingModule } from './workflow-routing.module';

describe('WorkflowComponent', () => {
  let component: WorkflowComponent;
  let fixture: ComponentFixture<WorkflowComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WorkflowComponent],
      imports: [
        ApolloTestingModule,
        HttpClientTestingModule,
        DialogModule,
        SafeAccessModule,
        SafeWorkflowStepperModule,
        SafeSkeletonModule,
        SafeEditableTextModule,
        WorkflowRoutingModule,
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
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({}),
          },
        },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkflowComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
