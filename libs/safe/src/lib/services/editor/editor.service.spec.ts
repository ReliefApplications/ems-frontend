import { TestBed } from '@angular/core/testing';
import { SafeEditorService } from './editor.service';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

describe('SafeEditorService', () => {
  let service: SafeEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: 'environment', useValue: {} }, TranslateService],
      imports: [
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
    });
    service = TestBed.inject(SafeEditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
