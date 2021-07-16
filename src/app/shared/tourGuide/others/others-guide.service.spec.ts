import { TestBed } from '@angular/core/testing';

import { OthersGuideService } from './others-guide.service';

describe('OthersGuideService', () => {
  let service: OthersGuideService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OthersGuideService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
