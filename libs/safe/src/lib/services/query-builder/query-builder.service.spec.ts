import { TestBed } from '@angular/core/testing';
import { UntypedFormBuilder } from '@angular/forms';
import { QueryBuilderService } from './query-builder.service';
import {
  ApolloTestingModule,
  ApolloTestingController,
} from 'apollo-angular/testing';
import { GET_QUERY_TYPES } from './graphql/queries';

describe('QueryBuilderService', () => {
  let service: QueryBuilderService;
  let controller: ApolloTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UntypedFormBuilder],
      imports: [ApolloTestingModule],
    });
    service = TestBed.inject(QueryBuilderService);

    controller = TestBed.inject(ApolloTestingController);

    const op = controller.expectOne(GET_QUERY_TYPES);

    op.flush({
      data: {
        __schema: {
          types: [],
        },
        fields: [],
      },
    });
  });

  afterEach(() => {
    controller.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
