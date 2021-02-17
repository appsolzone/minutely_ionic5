import { TestBed } from '@angular/core/testing';

import { AdminAddUsersService } from './admin-add-users';

describe('ManageUsersService', () => {
  let service: AdminAddUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdminAddUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
