import { TestBed } from '@angular/core/testing';

import { ChatsubmitToNodeService } from './chatsubmit-to-node.service';

describe('ChatsubmitToNodeService', () => {
  let service: ChatsubmitToNodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatsubmitToNodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
