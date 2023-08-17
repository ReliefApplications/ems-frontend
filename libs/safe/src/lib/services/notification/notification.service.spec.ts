import { TestBed } from '@angular/core/testing';
import { SafeNotificationService } from './notification.service';
import { HttpClientModule } from '@angular/common/http';
import { ApolloTestingModule } from 'apollo-angular/testing';

describe('SafeNotificationService', () => {
  let service: SafeNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule, HttpClientModule],
    });
    service = TestBed.inject(SafeNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
