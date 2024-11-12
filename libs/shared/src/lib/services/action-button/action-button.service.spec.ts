import { TestBed } from '@angular/core/testing';
import { ActionButtonService } from './action-button.service';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';

describe('ActionButtonService', () => {
  let service: ActionButtonService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: 'environment', useValue: {} }],
      imports: [ApolloTestingModule, HttpClientModule],
    });
    service = TestBed.inject(ActionButtonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
