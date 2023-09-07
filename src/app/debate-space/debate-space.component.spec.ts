import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DebateSpaceComponent } from './debate-space.component';

describe('DebateSpaceComponent', () => {
  let component: DebateSpaceComponent;
  let fixture: ComponentFixture<DebateSpaceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DebateSpaceComponent]
    });
    fixture = TestBed.createComponent(DebateSpaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
