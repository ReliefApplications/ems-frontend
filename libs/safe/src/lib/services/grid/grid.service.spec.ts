import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';

import { SafeGridService } from './grid.service';
import { TranslateModule } from '@ngx-translate/core';

describe('SafeGridService', () => {
  let service: SafeGridService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UntypedFormBuilder, { provide: 'environment', useValue: {} }],
      imports: [HttpClientModule, TranslateModule.forRoot()],
    });
    service = TestBed.inject(SafeGridService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
