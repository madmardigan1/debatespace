import { TestBed } from '@angular/core/testing';

import { NodeshareService } from './nodeshare.service';

describe('NodeshareService', () => {
  let service: NodeshareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NodeshareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
