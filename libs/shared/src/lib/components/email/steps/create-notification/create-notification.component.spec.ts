import { FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { SnackbarService } from '@oort-front/ui';
import { EmailService } from '../../email.service';
import { CreateNotificationComponent } from './create-notification.component';

describe('CreateNotificationComponent', () => {
  it('shows language names in the current and target languages', () => {
    const emailService = {
      datasetsForm: new FormGroup({}),
      notificationTypes: [],
    } as unknown as EmailService;
    const translate = {
      currentLang: 'en',
      defaultLang: 'en',
      getLangs: () => ['en', 'fr'],
    } as TranslateService;
    const component = new CreateNotificationComponent(
      emailService,
      {} as SnackbarService,
      translate
    );

    expect(component.getLanguageLabel('fr')).toBe('French / Français');
  });
});
