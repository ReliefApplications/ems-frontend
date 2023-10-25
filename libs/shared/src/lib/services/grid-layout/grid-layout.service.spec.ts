import { TestBed } from '@angular/core/testing';
import { GridLayoutService } from './grid-layout.service';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';

describe('GridLayoutService', () => {
  let service: GridLayoutService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ApolloTestingModule, HttpClientModule],
    });
    service = TestBed.inject(GridLayoutService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
