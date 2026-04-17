import { TestBed } from '@angular/core/testing';
import { ReferenceDataService } from './reference-data.service';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { HttpClientModule } from '@angular/common/http';

describe('ReferenceDataService', () => {
  let service: ReferenceDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{ provide: 'environment', useValue: {} }],
      imports: [ApolloTestingModule, HttpClientModule],
    });
    service = TestBed.inject(ReferenceDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should find a non primitive choice', async () => {
    jest.spyOn(service, 'cacheItems').mockResolvedValue({
      referenceData: {
        valueField: 'id',
      },
    } as any);
    jest.spyOn(service, 'getChoices').mockResolvedValue([
      {
        value: {
          id: 'fr',
          label: 'France',
        },
        text: 'France',
      },
    ]);

    await expect(
      service.getChoice(
        {
          value: {
            id: 'fr',
          },
        },
        'reference-data',
        'label',
        false
      )
    ).resolves.toEqual({
      value: {
        id: 'fr',
        label: 'France',
      },
      text: 'France',
    });
  });
});
