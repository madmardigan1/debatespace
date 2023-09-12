import { TestBed } from '@angular/core/testing';

import { ChatToNodeService } from './chat-to-node.service';

describe('ChatToNodeService', () => {
  let service: ChatToNodeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatToNodeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
