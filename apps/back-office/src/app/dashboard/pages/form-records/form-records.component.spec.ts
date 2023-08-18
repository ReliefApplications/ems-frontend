import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FormRecordsComponent } from './form-records.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { DialogModule } from '@angular/cdk/dialog';
import {
  SafeRecordHistoryModule,
  SafeSkeletonTableModule,
  SafeEmptyModule,
} from '@oort-front/safe';

describe('FormRecordsComponent', () => {
  let component: FormRecordsComponent;
  let fixture: ComponentFixture<FormRecordsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        ApolloTestingModule,
        HttpClientModule,
        DialogModule,
        SafeRecordHistoryModule,
        SafeSkeletonTableModule,
        SafeEmptyModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      declarations: [FormRecordsComponent],
      providers: [
        TranslateService,
        {
          provide: 'environment',
          useValue: {},
        },
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormRecordsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
