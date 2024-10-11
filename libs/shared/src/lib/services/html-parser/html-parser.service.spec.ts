import { TestBed } from '@angular/core/testing';
import { HtmlParserService } from './html-parser.service';

describe('HtmlParserService', () => {
  let service: HtmlParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HtmlParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
