import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  TranslateModule,
  TranslateService,
  TranslateFakeLoader,
  TranslateLoader,
} from '@ngx-translate/core';
import { SafeSchedulerComponent } from './scheduler.component';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';
import { SchedulerModule } from '@progress/kendo-angular-scheduler';

describe('SafeSchedulerComponent', () => {
  let component: SafeSchedulerComponent;
  let fixture: ComponentFixture<SafeSchedulerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [TranslateService],
      declarations: [SafeSchedulerComponent],
      imports: [
        TranslateModule.forRoot(),
        ApolloTestingModule,
        HttpClientModule,
        SchedulerModule,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeSchedulerComponent);
    component = fixture.componentInstance;
    component.settings = {
      source: '',
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
