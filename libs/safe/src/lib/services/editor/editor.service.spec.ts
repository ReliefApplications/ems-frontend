import { TestBed } from '@angular/core/testing';
import { SafeEditorService } from './editor.service';
import { TranslateModule } from '@ngx-translate/core';

describe('SafeEditorService', () => {
  let service: SafeEditorService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: 'environment', useValue: {} }],
      imports: [TranslateModule.forRoot()],
    });
    service = TestBed.inject(SafeEditorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
