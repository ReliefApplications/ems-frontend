import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScheduleAlertComponent } from './schedule-alert.component';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

describe('ScheduleAlertComponent', () => {
  let component: ScheduleAlertComponent;
  let fixture: ComponentFixture<ScheduleAlertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ScheduleAlertComponent],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      providers: [TranslateService],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
