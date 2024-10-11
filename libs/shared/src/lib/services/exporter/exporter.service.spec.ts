import { TestBed } from '@angular/core/testing';
import { ExporterService } from './exporter.service';

describe('ExporterService', () => {
  let service: ExporterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ExporterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
