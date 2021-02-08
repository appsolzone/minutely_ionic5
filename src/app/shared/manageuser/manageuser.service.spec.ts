import { TestBed } from '@angular/core/testing';

import { ManageuserService } from './manageuser.service';

describe('ManageuserService', () => {
  let service: ManageuserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageuserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
