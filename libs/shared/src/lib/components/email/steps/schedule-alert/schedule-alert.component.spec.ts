import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { SnackbarService } from '@oort-front/ui';
import { BehaviorSubject } from 'rxjs';
import { EmailService } from '../../email.service';
import { ScheduleAlertComponent } from './schedule-alert.component';

/** Default cron seeded by the component when the schedule has no valid value */
const DEFAULT_CRON = '0/5 * 1/1 * *';
/** A valid cron expression different from the seeded default */
const VALID_CRON = '0 12 * * *';
/** Debounce applied to cron value changes before validity is recomputed */
const CRON_DEBOUNCE_MS = 500;

describe('ScheduleAlertComponent', () => {
  let fixture: ComponentFixture<ScheduleAlertComponent>;
  let component: ScheduleAlertComponent;
  let emailServiceMock: {
    datasetsForm: FormGroup;
    disableSaveAndProceed: BehaviorSubject<boolean>;
  };
  let snackBarMock: { openSnackBar: jest.Mock };

  /**
   * Creates the component over a schedule form seeded with the given values.
   *
   * @param scheduleEnabled Initial value of the schedule toggle
   * @param cronValue Initial (possibly legacy / invalid) cron value
   */
  const createComponent = (
    scheduleEnabled: boolean,
    cronValue: string | null
  ) => {
    emailServiceMock.datasetsForm = new FormGroup({
      schedule: new FormGroup({
        scheduleEnabled: new FormControl(scheduleEnabled),
        cronValue: new FormControl(cronValue),
      }),
    });
    fixture = TestBed.createComponent(ScheduleAlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  beforeEach(async () => {
    emailServiceMock = {
      datasetsForm: undefined as unknown as FormGroup,
      disableSaveAndProceed: new BehaviorSubject<boolean>(false),
    };
    snackBarMock = { openSnackBar: jest.fn() };

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
      providers: [
        { provide: EmailService, useValue: emailServiceMock },
        { provide: SnackbarService, useValue: snackBarMock },
      ],
    })
      // Logic-only tests: the template pulls in cron editor & ui widgets
      .overrideTemplate(ScheduleAlertComponent, '')
      .compileComponents();
  });

  it('should create', () => {
    createComponent(false, null);
    expect(component).toBeTruthy();
  });

  describe('on init', () => {
    it('keeps Next enabled and leaves the cron untouched when the schedule is disabled', () => {
      createComponent(false, null);
      expect(component.scheduleCron.value).toBeNull();
      expect(emailServiceMock.disableSaveAndProceed.value).toBe(false);
      expect(snackBarMock.openSnackBar).not.toHaveBeenCalled();
    });

    it('seeds the default cron when the schedule is enabled with no saved value', () => {
      createComponent(true, null);
      expect(component.scheduleCron.value).toBe(DEFAULT_CRON);
      expect(component.cronValid).toBe(true);
      expect(emailServiceMock.disableSaveAndProceed.value).toBe(false);
      expect(snackBarMock.openSnackBar).not.toHaveBeenCalled();
    });

    it('replaces a legacy invalid saved cron with the default', () => {
      createComponent(true, 'every day at noon');
      expect(component.scheduleCron.value).toBe(DEFAULT_CRON);
      expect(emailServiceMock.disableSaveAndProceed.value).toBe(false);
    });

    it('preserves a valid saved cron', () => {
      createComponent(true, VALID_CRON);
      expect(component.scheduleCron.value).toBe(VALID_CRON);
      expect(component.cronValid).toBe(true);
      expect(emailServiceMock.disableSaveAndProceed.value).toBe(false);
    });
  });

  describe('toggling the schedule', () => {
    it('seeds the default cron and keeps Next enabled when enabling with an empty cron', fakeAsync(() => {
      createComponent(false, null);
      component.scheduleForm.get('scheduleEnabled')?.setValue(true);
      expect(component.scheduleCron.value).toBe(DEFAULT_CRON);
      expect(emailServiceMock.disableSaveAndProceed.value).toBe(false);
      tick(CRON_DEBOUNCE_MS);
      expect(emailServiceMock.disableSaveAndProceed.value).toBe(false);
      expect(snackBarMock.openSnackBar).not.toHaveBeenCalled();
    }));

    it('re-enables Next when disabling the schedule while the cron is invalid', fakeAsync(() => {
      createComponent(true, VALID_CRON);
      component.scheduleCron.setValue('not a cron');
      tick(CRON_DEBOUNCE_MS);
      expect(emailServiceMock.disableSaveAndProceed.value).toBe(true);

      component.scheduleForm.get('scheduleEnabled')?.setValue(false);
      expect(emailServiceMock.disableSaveAndProceed.value).toBe(false);
    }));
  });

  describe('editing the cron', () => {
    it('disables Next and warns once the debounce elapses on an invalid cron', fakeAsync(() => {
      createComponent(true, VALID_CRON);
      component.scheduleCron.setValue('not a cron');
      // Not applied before the debounce
      expect(emailServiceMock.disableSaveAndProceed.value).toBe(false);
      expect(snackBarMock.openSnackBar).not.toHaveBeenCalled();

      tick(CRON_DEBOUNCE_MS);
      expect(component.cronValid).toBe(false);
      expect(emailServiceMock.disableSaveAndProceed.value).toBe(true);
      expect(snackBarMock.openSnackBar).toHaveBeenCalledTimes(1);
      expect(snackBarMock.openSnackBar).toHaveBeenCalledWith(
        'components.email.alert.scheduler.invalid',
        { error: true }
      );
    }));

    it('only warns once for rapid successive invalid values', fakeAsync(() => {
      createComponent(true, VALID_CRON);
      component.scheduleCron.setValue('a');
      tick(100);
      component.scheduleCron.setValue('ab');
      tick(100);
      component.scheduleCron.setValue('abc');
      tick(CRON_DEBOUNCE_MS);
      expect(snackBarMock.openSnackBar).toHaveBeenCalledTimes(1);
      expect(emailServiceMock.disableSaveAndProceed.value).toBe(true);
    }));

    it('re-enables Next when the cron becomes valid again', fakeAsync(() => {
      createComponent(true, VALID_CRON);
      component.scheduleCron.setValue('not a cron');
      tick(CRON_DEBOUNCE_MS);
      expect(emailServiceMock.disableSaveAndProceed.value).toBe(true);

      component.scheduleCron.setValue('*/10 * * * *');
      tick(CRON_DEBOUNCE_MS);
      expect(component.cronValid).toBe(true);
      expect(emailServiceMock.disableSaveAndProceed.value).toBe(false);
      // No new warning for the valid value
      expect(snackBarMock.openSnackBar).toHaveBeenCalledTimes(1);
    }));
  });
});
