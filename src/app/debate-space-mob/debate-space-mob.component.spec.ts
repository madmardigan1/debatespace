import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebateSpaceMobComponent } from './debate-space-mob.component';

describe('DebateSpaceMobComponent', () => {
  let component: DebateSpaceMobComponent;
  let fixture: ComponentFixture<DebateSpaceMobComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DebateSpaceMobComponent]
    });
    fixture = TestBed.createComponent(DebateSpaceMobComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
