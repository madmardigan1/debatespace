import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatSubmitComponent } from './chat-submit.component';

describe('ChatSubmitComponent', () => {
  let component: ChatSubmitComponent;
  let fixture: ComponentFixture<ChatSubmitComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ChatSubmitComponent]
    });
    fixture = TestBed.createComponent(ChatSubmitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
