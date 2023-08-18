import { TestBed } from '@angular/core/testing';
import { SafeRestService } from './rest.service';
import { HttpClientModule } from '@angular/common/http';

describe('RestService', () => {
  let service: SafeRestService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: 'environment', useValue: {} }],
      imports: [HttpClientModule],
    });
    service = TestBed.inject(SafeRestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
