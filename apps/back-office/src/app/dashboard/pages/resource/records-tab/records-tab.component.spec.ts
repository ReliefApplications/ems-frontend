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
import { SkeletonTableModule } from '@oort-front/shared';

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
        {
          provide: 'environment',
          useValue: {},
        },
      ],
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
