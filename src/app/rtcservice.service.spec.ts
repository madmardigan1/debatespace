import { TestBed } from '@angular/core/testing';

import { RTCServiceService } from './rtcservice.service';

describe('RTCServiceService', () => {
  let service: RTCServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RTCServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
