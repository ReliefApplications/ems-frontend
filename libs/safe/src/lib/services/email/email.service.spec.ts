import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { DialogModule as DialogCdkModule } from '@angular/cdk/dialog';
import { environment } from 'projects/back-office/src/environments/environment';
import {
  TranslateModule,
  TranslateService,
  TranslateFakeLoader,
  TranslateLoader,
} from '@ngx-translate/core';

import { SafeEmailService } from './email.service';

describe('SafeEmailService', () => {
  let service: SafeEmailService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: 'environment', useValue: environment },
        TranslateService,
      ],
      imports: [
        HttpClientModule,
        DialogCdkModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
    });
    service = TestBed.inject(SafeEmailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
