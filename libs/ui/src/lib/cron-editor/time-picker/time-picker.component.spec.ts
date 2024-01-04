import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TimePickerComponent } from './time-picker.component';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';
import { TranslateTestingModule } from 'ngx-translate-testing';
import { SelectMenuModule } from '../../select-menu/select-menu.module';

describe('TimePickerComponent', () => {
  let component: TimePickerComponent;
  let fixture: ComponentFixture<TimePickerComponent>;

  const formGroupDirective: FormGroupDirective = new FormGroupDirective([], []);
  formGroupDirective.form = new FormGroup({
    seconds: new FormControl(),
    minutes: new FormControl(),
    hours: new FormControl(),
    hoursType: new FormControl(),
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TimePickerComponent],
      providers: [
        {
          provide: ControlContainer,
          useValue: formGroupDirective,
        },
      ],
      imports: [
        ReactiveFormsModule,
        SelectMenuModule,
        TranslateTestingModule.withTranslations('en', {
          common: {
            cronEditor: {
              hours: 'Hour(s)',
              minutes: 'Minute(s)',
              seconds: 'Second(s)',
            },
          },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TimePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
