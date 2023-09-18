import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { RecordsTabComponent } from './records-tab.component';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { DialogModule } from '@angular/cdk/dialog';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SafeSkeletonTableModule } from '@oort-front/safe';

describe('RecordsTabComponent', () => {
  let component: RecordsTabComponent;
  let fixture: ComponentFixture<RecordsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RecordsTabComponent],
      imports: [
        ApolloTestingModule,
        DialogModule,
        HttpClientTestingModule,
        SafeSkeletonTableModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
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
    fixture = TestBed.createComponent(RecordsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
