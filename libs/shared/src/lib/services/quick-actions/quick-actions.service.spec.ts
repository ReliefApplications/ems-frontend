import { TestBed } from '@angular/core/testing';
import { QuickActionsService } from './quick-actions.service';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';

describe('QuickActionsService', () => {
  let service: QuickActionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: 'environment', useValue: {} }],
      imports: [ApolloTestingModule, HttpClientModule],
    });
    service = TestBed.inject(QuickActionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
