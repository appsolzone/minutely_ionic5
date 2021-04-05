import { TestBed } from '@angular/core/testing';

import { ItemUpdatesService } from './item-updates.service';

describe('ItemUpdatesService', () => {
  let service: ItemUpdatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ItemUpdatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
