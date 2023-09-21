import { TestBed } from '@angular/core/testing';

import { TopicMenuService } from './topic-menu.service';

describe('TopicMenuService', () => {
  let service: TopicMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TopicMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
