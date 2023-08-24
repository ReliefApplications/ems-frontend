import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';

import { SafeGridService } from './grid.service';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

describe('SafeGridService', () => {
  let service: SafeGridService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UntypedFormBuilder,
        { provide: 'environment', useValue: {} },
        TranslateService,
      ],
      imports: [
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
    });
    service = TestBed.inject(SafeGridService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
