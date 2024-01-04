import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CronEditorComponent } from './cron-editor.component';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { TabsModule } from '../tabs/tabs.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

describe('CronEditorComponent', () => {
  let component: CronEditorComponent;
  let fixture: ComponentFixture<CronEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CronEditorComponent],
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        TabsModule,
        TranslateTestingModule.withTranslations('en', {
          common: {
            cronEditor: {
              minutely: 'Minutely',
              every: {
                femenine: 'Every',
                masculine: 'Every',
              },
              minutes: 'Minute(s)',
              atTime: 'At',
              hourly: 'hourly',
              hours: 'Hour(s)',
              daily: 'Daily',
              days: 'Day(s)',
              weekDay: 'WeekDay',
              weekly: 'Weekly',
            },
          },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CronEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
