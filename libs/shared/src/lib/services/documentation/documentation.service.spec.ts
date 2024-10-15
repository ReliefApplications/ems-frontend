import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { DocumentationService } from './documenation.service';
import { ApolloTestingModule } from 'apollo-angular/testing';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

describe('DocumentationService', () => {
  let service: DocumentationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: 'environment', useValue: {} }, TranslateService],
      imports: [
        HttpClientModule,
        ApolloTestingModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
    });
    service = TestBed.inject(DocumentationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
