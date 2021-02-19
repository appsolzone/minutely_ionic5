import { TestBed } from '@angular/core/testing';

import { TextsearchService } from './textsearch.service';

describe('TextsearchService', () => {
  let service: TextsearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TextsearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
