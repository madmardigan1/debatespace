import { TestBed } from '@angular/core/testing';

import { SpaceServiceService } from './space-service.service';

describe('SpaceServiceService', () => {
  let service: SpaceServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SpaceServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
