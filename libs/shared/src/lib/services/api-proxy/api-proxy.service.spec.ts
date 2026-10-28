import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { ApiProxyService } from './api-proxy.service';
import { ApolloTestingModule } from 'apollo-angular/testing';
import { ApiConfiguration } from '../../models/api-configuration.model';

describe('ApiProxyService', () => {
  let service: ApiProxyService;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: 'environment', useValue: { apiUrl: 'http://api.test' } },
      ],
      imports: [HttpClientTestingModule, ApolloTestingModule],
    });
    service = TestBed.inject(ApiProxyService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('buildPingRequest', () => {
    /** Configuration as edited in the API configuration page */
    const api: ApiConfiguration = {
      id: 'api-id',
      name: 'tested-api',
      endpoint: 'https://api.example.com',
      pingUrl: 'health',
      settings: { authTargetUrl: '●●●●●●●●●●●●●' },
    };

    it('posts the edited configuration to the ping endpoint and resolves the status', (done) => {
      service.buildPingRequest(api)?.subscribe((res) => {
        expect(res).toEqual({ status: 200 });
        done();
      });
      const req = http.expectOne('http://api.test/proxy/ping/health');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(api);
      req.flush({ status: 200 });
    });

    it('propagates the back-end refusal', (done) => {
      service.buildPingRequest(api)?.subscribe({
        next: () => done.fail('should not succeed'),
        error: (err) => {
          expect(err.status).toBe(403);
          done();
        },
      });
      http
        .expectOne('http://api.test/proxy/ping/health')
        .flush('Permission not granted.', {
          status: 403,
          statusText: 'Forbidden',
        });
    });

    it('returns nothing when the configuration has no ping url', () => {
      expect(service.buildPingRequest({ ...api, pingUrl: '' })).toBeUndefined();
      http.expectNone(() => true);
    });
  });
});
