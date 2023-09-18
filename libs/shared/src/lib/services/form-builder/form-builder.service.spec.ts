import { TestBed } from '@angular/core/testing';
import { FormBuilderService } from './form-builder.service';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';

describe('FormBuilderService', () => {
  let service: FormBuilderService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: 'environment', useValue: {} }, TranslateService],
      imports: [
        ApolloTestingModule,
        HttpClientModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
    });
    service = TestBed.inject(FormBuilderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
