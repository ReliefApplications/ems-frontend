import { TestBed } from '@angular/core/testing';
import { PublicAuthService } from './public-auth.service';

describe('PublicAuthService', () => {
  let service: PublicAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [],
      imports: [],
    });

    service = TestBed.inject(PublicAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
