import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopicMenuComponent } from './topic-menu.component';

describe('TopicMenuComponent', () => {
  let component: TopicMenuComponent;
  let fixture: ComponentFixture<TopicMenuComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TopicMenuComponent]
    });
    fixture = TestBed.createComponent(TopicMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
