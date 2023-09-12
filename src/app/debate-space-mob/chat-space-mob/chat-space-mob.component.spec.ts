import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatSpaceMobComponent } from './chat-space-mob.component';

describe('ChatSpaceMobComponent', () => {
  let component: ChatSpaceMobComponent;
  let fixture: ComponentFixture<ChatSpaceMobComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatSpaceMobComponent]
    });
    fixture = TestBed.createComponent(ChatSpaceMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
