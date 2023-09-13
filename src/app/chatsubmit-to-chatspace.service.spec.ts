import { TestBed } from '@angular/core/testing';

import { ChatsubmitToChatspaceService } from './chatsubmit-to-chatspace.service';

describe('ChatsubmitToChatspaceService', () => {
  let service: ChatsubmitToChatspaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ChatsubmitToChatspaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
