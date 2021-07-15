import { TestBed } from '@angular/core/testing';

import { MeetingPageGuideService } from './meeting-page-guide.service';

describe('MeetingPageGuideService', () => {
  let service: MeetingPageGuideService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeetingPageGuideService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
