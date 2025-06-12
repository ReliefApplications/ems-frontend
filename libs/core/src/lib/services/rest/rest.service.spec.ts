import { TestBed } from '@angular/core/testing';
import { RestService } from './rest.service';
import { HttpClientModule } from '@angular/common/http';

describe('RestService', () => {
  let service: RestService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: 'environment', useValue: {} }],
      imports: [HttpClientModule],
    });
    service = TestBed.inject(RestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
