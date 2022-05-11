import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  TranslateModule,
  TranslateService,
  TranslateFakeLoader,
  TranslateLoader,
} from '@ngx-translate/core';
import { SafeSchedulerComponent } from './scheduler.component';

describe('SafeSchedulerComponent', () => {
  let component: SafeSchedulerComponent;
  let fixture: ComponentFixture<SafeSchedulerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [TranslateService],
      declarations: [SafeSchedulerComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
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
