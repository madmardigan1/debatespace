import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatSubmitMobComponent } from './chat-submit-mob.component';

describe('ChatSubmitMobComponent', () => {
  let component: ChatSubmitMobComponent;
  let fixture: ComponentFixture<ChatSubmitMobComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatSubmitMobComponent]
    });
    fixture = TestBed.createComponent(ChatSubmitMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
