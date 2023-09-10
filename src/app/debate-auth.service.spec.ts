import { TestBed } from '@angular/core/testing';

import { DebateAuthService } from './debate-auth.service';

describe('DebateAuthService', () => {
  let service: DebateAuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DebateAuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
