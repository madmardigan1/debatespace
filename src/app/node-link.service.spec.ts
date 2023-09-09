import { TestBed } from '@angular/core/testing';

import { NodeLinkService } from './node-link.service';

describe('NodeLinkService', () => {
  let service: NodeLinkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NodeLinkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
