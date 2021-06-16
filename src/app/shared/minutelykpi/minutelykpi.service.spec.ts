import { TestBed } from '@angular/core/testing';

import { MinutelyKpiService } from './kpi.service';

describe('MinutelyKpiService', () => {
  let service: MinutelyKpiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MinutelyKpiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
