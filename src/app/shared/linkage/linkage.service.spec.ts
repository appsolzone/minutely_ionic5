import { TestBed } from '@angular/core/testing';

import { LinkageService } from './linkage.service';

describe('LinkageService', () => {
  let service: LinkageService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LinkageService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
