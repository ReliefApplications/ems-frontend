import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReferenceDatasComponent } from './reference-datas.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
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
import { AppAbility } from '@oort-front/shared';
import { PureAbility } from '@casl/ability';
import { FilterComponent } from './components/filter/filter.component';
import { AddReferenceDataComponent } from './add-reference-data/add-reference-data.component';
import { AbilityModule } from '@casl/angular';
import {
  MenuModule,
  ButtonModule,
  FormWrapperModule,
  IconModule,
  TableModule,
  PaginatorModule,
} from '@oort-front/ui';
import { DateModule, SkeletonTableModule } from '@oort-front/shared';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

describe('ReferenceDatasComponent', () => {
  let component: ReferenceDatasComponent;
  let fixture: ComponentFixture<ReferenceDatasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        ReferenceDatasComponent,
        FilterComponent,
        AddReferenceDataComponent,
      ],
      imports: [
        ApolloTestingModule,
        DialogModule,
        HttpClientTestingModule,
        AbilityModule,
        MenuModule,
        ButtonModule,
        FormWrapperModule,
        IconModule,
        TableModule,
        PaginatorModule,
        DateModule,
        SkeletonTableModule,
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
        PureAbility,
        {
          provide: 'environment',
          useValue: {},
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferenceDatasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
