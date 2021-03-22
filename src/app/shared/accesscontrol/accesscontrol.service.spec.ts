import { TestBed } from '@angular/core/testing';

import { AccesscontrolService } from './accesscontrol.service';

describe('AccesscontrolService', () => {
  let service: AccesscontrolService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccesscontrolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
