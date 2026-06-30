import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { ApiConfigurationComponent } from './api-configuration.component';
import { ActivatedRoute } from '@angular/router';
import {
  TranslateFakeLoader,
  TranslateLoader,
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SpinnerModule } from '@oort-front/ui';

describe('ApiConfigurationComponent', () => {
  let component: ApiConfigurationComponent;
  let fixture: ComponentFixture<ApiConfigurationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ApiConfigurationComponent],
      imports: [
        HttpClientTestingModule,
        ApolloTestingModule,
        SpinnerModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useClass: TranslateFakeLoader,
          },
        }),
      ],
      providers: [
        TranslateService,
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => {
                  return {};
                },
              },
            },
          },
        },
        {
          provide: 'environment',
          useValue: {},
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ApiConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
