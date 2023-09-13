import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogModule } from '@angular/cdk/dialog';
import { PullJobsComponent } from './pull-jobs.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  ButtonModule,
  PaginatorModule,
} from '@oort-front/ui';
import { SafeSkeletonTableModule } from '@oort-front/safe';

describe('PullJobsComponent', () => {
  let component: PullJobsComponent;
  let fixture: ComponentFixture<PullJobsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PullJobsComponent],
      imports: [
        DialogModule,
        ApolloTestingModule,
        ButtonModule,
        PaginatorModule,
        SafeSkeletonTableModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      providers: [TranslateService]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PullJobsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
