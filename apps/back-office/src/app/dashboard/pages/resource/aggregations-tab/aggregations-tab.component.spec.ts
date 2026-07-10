import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { AggregationsTabComponent } from './aggregations-tab.component';
import { DialogRef, DialogModule } from '@angular/cdk/dialog';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  MenuModule,
  ButtonModule,
  TableModule,
  PaginatorModule,
} from '@oort-front/ui';
import { SkeletonTableModule } from '@oort-front/shared';

describe('AggregationsTabComponent', () => {
  let component: AggregationsTabComponent;
  let fixture: ComponentFixture<AggregationsTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AggregationsTabComponent],
      imports: [
        ApolloTestingModule,
        DialogModule,
        MenuModule,
        ButtonModule,
        TableModule,
        PaginatorModule,
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
          provide: DialogRef,
          useValue: {
            updateSize: jest.fn(),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AggregationsTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
