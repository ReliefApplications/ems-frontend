import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
} from '@ngx-translate/core';
import { EmailDeliveryComponent } from './email-delivery.component';

describe('EmailDeliveryComponent', () => {
  let fixture: ComponentFixture<EmailDeliveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        EmailDeliveryComponent,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EmailDeliveryComponent);
  });

  it('renders scheduled delivery with the primary chip', () => {
    fixture.componentRef.setInput('schedule', { scheduleEnabled: true });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.bg-primary-100')).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain(
      'components.email.notification.scheduled'
    );
  });

  it.each([
    ['disabled', { scheduleEnabled: false }],
    ['null', null],
    ['missing', undefined],
    ['missing flag', {}],
  ])('renders manual delivery for a %s schedule', (_case, schedule) => {
    fixture.componentRef.setInput('schedule', schedule);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.bg-gray-300')).toBeTruthy();
    expect(fixture.nativeElement.textContent).toContain(
      'components.email.notification.manual'
    );
  });
});
