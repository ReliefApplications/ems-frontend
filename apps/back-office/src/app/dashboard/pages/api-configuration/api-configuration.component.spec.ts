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
import { HttpErrorResponse } from '@angular/common/http';
import { SnackbarService, SpinnerModule } from '@oort-front/ui';
import { ApiProxyService } from '@oort-front/shared';
import { of, throwError } from 'rxjs';

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

  describe('onPing', () => {
    let openSnackBar: jest.SpyInstance;
    let buildPingRequest: jest.SpyInstance;

    beforeEach(() => {
      openSnackBar = jest
        .spyOn(TestBed.inject(SnackbarService), 'openSnackBar')
        .mockImplementation(() => undefined as any);
      buildPingRequest = jest.spyOn(
        TestBed.inject(ApiProxyService),
        'buildPingRequest'
      );
      // The form is only built once the configuration is loaded: build it directly
      component.apiForm = component['createApiForm']({
        pingUrl: 'health',
        endpoint: 'https://api.example.com',
      } as any);
    });

    it('notifies a positive response, whatever the upstream status body', () => {
      buildPingRequest.mockReturnValue(of({ status: 200 }));
      component.onPing();
      expect(openSnackBar).toHaveBeenCalledWith(
        'pages.apiConfiguration.notifications.pingReceived',
        { error: false }
      );
    });

    it('explains a 403 as a missing permission', () => {
      buildPingRequest.mockReturnValue(
        throwError(() => new HttpErrorResponse({ status: 403 }))
      );
      component.onPing();
      expect(openSnackBar).toHaveBeenCalledWith(
        'pages.apiConfiguration.notifications.pingForbidden',
        { error: true }
      );
    });

    it('explains a 400 as a non-public URL', () => {
      buildPingRequest.mockReturnValue(
        throwError(() => new HttpErrorResponse({ status: 400 }))
      );
      component.onPing();
      expect(openSnackBar).toHaveBeenCalledWith(
        'pages.apiConfiguration.notifications.pingInvalidUrl',
        { error: true }
      );
    });

    it('reports any other error as a failed ping', () => {
      buildPingRequest.mockReturnValue(
        throwError(() => new HttpErrorResponse({ status: 503 }))
      );
      component.onPing();
      expect(openSnackBar).toHaveBeenCalledWith(
        'pages.apiConfiguration.notifications.pingFailed',
        { error: true }
      );
    });

    it('does nothing when no ping url is set', () => {
      buildPingRequest.mockReturnValue(undefined);
      component.onPing();
      expect(openSnackBar).not.toHaveBeenCalled();
    });
  });
});
